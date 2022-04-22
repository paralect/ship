using Api.Sql.Security;
using Api.Sql.Services.Interfaces;
using Api.Views.Models.Infrastructure.Email;
using Api.Views.Models.View.Account;
using Api.Views.Models.View.User;
using AutoMapper;
using Common;
using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.Services.Infrastructure.Interfaces;
using Common.Services.Sql.Domain.Interfaces;
using Common.Settings;
using Common.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Api.Sql.Controllers
{
    public class AccountController : BaseController
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        private readonly IWebHostEnvironment _environment;
        private readonly AppSettings _appSettings;
        private readonly IMapper _mapper;

        public AccountController(
            IAuthService authService,
            IEmailService emailService,
            IUserService userService,
            ITokenService tokenService,
            IWebHostEnvironment environment,
            IOptions<AppSettings> appSettings,
            IMapper mapper)
        {
            _authService = authService;
            _emailService = emailService;
            _userService = userService;
            _tokenService = tokenService;

            _environment = environment;
            _appSettings = appSettings.Value;
            _mapper = mapper;
        }

        [HttpPost("sign-in")]
        public async Task<IActionResult> SignInAsync([FromBody] SignInModel model)
        {
            var user = await _userService.FindOneAsync(new UserFilter
            {
                Email = model.Email,
                AsNoTracking = true
            },
            x => new User
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                PasswordHash = x.PasswordHash,
                IsEmailVerified = x.IsEmailVerified,
            });

            if (user == null || !model.Password.IsHashEqual(user.PasswordHash))
            {
                return BadRequest("Credentials", "Incorrect email or password.");
            }

            if (user.IsEmailVerified == false)
            {
                return BadRequest(nameof(model.Email), "Please verify your email to sign in.");
            }

            await _userService.SignInAsync(user.Id);
            await _authService.SetTokensAsync(user.Id);

            return Ok(_mapper.Map<UserViewModel>(user));
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUpAsync([FromBody] SignUpModel model)
        {
            var doesUserExist = await _userService.AnyAsync(new UserFilter
            {
                Email = model.Email
            });
            if (doesUserExist)
            {
                return BadRequest(nameof(model.Email), "User with this email is already registered.");
            }

            var newUser = await _userService.CreateUserAccountAsync(model);

            if (_environment.IsDevelopment())
            {
                return Ok(new { signupToken = newUser.SignupToken });
            }

            return Ok();
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmailAsync([FromQuery] string token)
        {
            if (token == null)
            {
                return BadRequest("Token", "Token is required.");
            }

            var user = await _userService.FindOneAsync(new UserFilter
            {
                SignupToken = token,
                AsNoTracking = true
            },
            x => new User
            {
                Id = x.Id
            });

            if (user == null)
            {
                return BadRequest("Token", "Token is invalid.");
            }

            await _userService.VerifyEmailAsync(user.Id);
            await _authService.SetTokensAsync(user.Id);

            return Redirect(_appSettings.WebUrl);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPasswordAsync([FromBody] ForgotPasswordModel model)
        {
            var user = await _userService.FindOneAsync(new UserFilter
            {
                Email = model.Email,
                AsNoTracking = true
            },
            x => new User
            {
                Id = x.Id,
                Email = x.Email,
                FirstName = x.FirstName
            });

            if (user != null)
            {
                var resetPasswordToken = await _userService.SetResetPasswordTokenAsync(user.Id);

                await _emailService.SendForgotPasswordAsync(new ForgotPasswordEmailModel
                {
                    Email = user.Email,
                    ResetPasswordToken = resetPasswordToken,
                    FirstName = user.FirstName
                });
            }

            return Ok();
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordModel model)
        {
            var user = await _userService.FindOneAsync(new UserFilter
            {
                ResetPasswordToken = model.Token,
                AsNoTracking = true
            },
            x => new User
            {
                Id = x.Id
            });

            if (user == null)
            {
                return BadRequest(nameof(model.Token), "Password reset link has expired or invalid.");
            }

            await _userService.UpdatePasswordAsync(user.Id, model.Password);

            return Ok();
        }

        [HttpPost("resend")]
        public async Task<IActionResult> ResendVerificationAsync([FromBody] ResendVerificationModel model)
        {
            var user = await _userService.FindOneAsync(new UserFilter
            {
                Email = model.Email,
                AsNoTracking = true
            },
            x => new User
            {
                FirstName = x.FirstName,
                SignupToken = x.SignupToken
            });

            if (user != null)
            {
                await _emailService.SendSignUpAsync(new SignUpEmailModel
                {
                    Email = model.Email,
                    FirstName = user.FirstName,
                    SignUpToken = user.SignupToken
                });
            }

            return Ok();
        }

        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshTokenAsync()
        {
            var tokenValue = Request.Cookies[Constants.CookieNames.RefreshToken];

            var token = await _tokenService.FindOneAsync(new TokenFilter
            {
                Value = tokenValue,
                AsNoTracking = true
            },
            x => new Token
            {
                UserId = x.UserId,
                ExpireAt = x.ExpireAt
            });

            if (token == null || token.IsExpired())
            {
                return Unauthorized();
            }

            await _authService.SetTokensAsync(token.UserId);

            return Ok();
        }

        [HttpPost("sign-out")]
        public async Task<IActionResult> SignOutAsync()
        {
            if (CurrentUserId != null)
            {
                await _authService.UnsetTokensAsync(CurrentUserId.Value);
            }

            return Ok();
        }
    }
}