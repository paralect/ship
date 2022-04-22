using System.Linq.Expressions;
using Api.Sql.Controllers;
using Api.Sql.Services.Interfaces;
using Api.Views.Models.Infrastructure.Email;
using Api.Views.Models.View.Account;
using AutoMapper;
using Common;
using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.Enums;
using Common.Services.Infrastructure.Interfaces;
using Common.Services.Sql.Domain.Interfaces;
using Common.Settings;
using Common.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Tests.Sql
{
    public class AccountControllerTests
    {
        private readonly Mock<IEmailService> _emailService;
        private readonly Mock<IUserService> _userService;
        private readonly Mock<ITokenService> _tokenService;
        private readonly Mock<IAuthService> _authService;
        private readonly Mock<IWebHostEnvironment> _environment;
        private readonly Mock<IOptions<AppSettings>> _appSettingsOptions;
        private readonly Mock<IMapper> _mapper;
        private readonly AppSettings _appSettings;

        public AccountControllerTests()
        {
            _emailService = new Mock<IEmailService>();
            _userService = new Mock<IUserService>();
            _tokenService = new Mock<ITokenService>();
            _authService = new Mock<IAuthService>();
            _environment = new Mock<IWebHostEnvironment>();
            _appSettingsOptions = new Mock<IOptions<AppSettings>>();
            _mapper = new Mock<IMapper>();

            _appSettings = new AppSettings
            {
                WebUrl = "http://test.com",
                LandingUrl = "http://test-landing.com"
            };
        }

        [Fact]
        public async Task SignUpShouldReturnBadRequestWhenUserAlreadyExist()
        {
            // Arrange
            var model = new SignUpModel
            {
                Email = "sample@sample.com"
            };

            _userService.Setup(service => service.AnyAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email)
                ))
                .ReturnsAsync(true);

            var controller = CreateInstance();

            // Act
            var result = await controller.SignUpAsync(model);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Theory]
        [InlineData("Development")]
        [InlineData("Production")]
        public async Task SignUpShouldReturnOkWhenUserDoesNotExist(string environmentName)
        {
            // Arrange
            var expectedResult = environmentName == "Development" ? typeof(OkObjectResult) : typeof(OkResult);
            var model = new SignUpModel
            {
                Email = "sample@sample.com"
            };

            _userService.Setup(service => service.AnyAsync(It.Is<UserFilter>(filter => filter.Email == model.Email)))
                .ReturnsAsync(false);

            _userService.Setup(service => service.CreateUserAccountAsync(model))
                .ReturnsAsync(new User());

            _environment.Setup(environment => environment.EnvironmentName).Returns(environmentName);

            var controller = CreateInstance();

            // Act
            var result = await controller.SignUpAsync(model);

            // Assert
            Assert.IsType(expectedResult, result);
        }

        [Fact]
        public async Task VerifyEmailShouldReturnBadRequestWhenTokenIsNull()
        {
            // Arrange
            var controller = CreateInstance();

            // Act
            var result = await controller.VerifyEmailAsync(null);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task VerifyEmailShouldReturnBadRequestWhenTokenIsInvalid()
        {
            // Arrange
            var token = "sample";

            _userService.Setup(service => service.FindOneAsync(It.Is<UserFilter>(filter => filter.SignupToken == token)))
                .ReturnsAsync((User)null);

            var controller = CreateInstance();

            // Act
            var result = await controller.VerifyEmailAsync(token);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task VerifyEmailShouldMarkEmailAsVerifiedAndReturnRedirectToMainPage()
        {
            // Arrange
            var token = "sample";
            var user = new User
            {
                Id = 1
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.SignupToken == token && filter.AsNoTracking),
                    It.IsAny<Expression<Func<User, User>>>()))
                .ReturnsAsync(user);

            var controller = CreateInstance();

            // Act
            var result = await controller.VerifyEmailAsync(token);

            // Assert
            _userService.Verify(service => service.VerifyEmailAsync(user.Id), Times.Once);
            _authService.Verify(service => service.SetTokensAsync(user.Id), Times.Once);
            Assert.True((result as RedirectResult)?.Url == _appSettings.WebUrl);
        }

        [Fact]
        public async Task SignInShouldReturnBadRequestWhenUserDoesNotExist()
        {
            // Arrange
            var model = new SignInModel
            {
                Email = "test@test.com"
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email && filter.AsNoTracking)))
                .ReturnsAsync((User)null);

            var controller = CreateInstance();

            // Act
            var result = await controller.SignInAsync(model);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task SignInShouldReturnBadRequestWhenPasswordIsIncorrect()
        {
            // Arrange
            var model = new SignInModel
            {
                Email = "test@test.com",
                Password = "sample2"
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email && filter.AsNoTracking)))
                .ReturnsAsync(new User { PasswordHash = "sample".GetHash() });

            var controller = CreateInstance();

            // Act
            var result = await controller.SignInAsync(model);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task SignInShouldReturnBadRequestWhenEmailDoesNotVerified()
        {
            // Arrange
            var password = "sample";
            var user = new User
            {
                PasswordHash = password.GetHash(),
                IsEmailVerified = false
            };
            var model = new SignInModel
            {
                Email = "test@test.com",
                Password = password
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email && filter.AsNoTracking)))
                .ReturnsAsync(user);

            var controller = CreateInstance();

            // Act
            var result = await controller.SignInAsync(model);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task SignInShouldReturnOkObjectResult()
        {
            // Arrange
            var userId = 1;
            var userRole = UserRole.User;
            var password = "sample";
            var user = new User
            {
                Id = userId,
                Role = userRole,
                PasswordHash = password.GetHash(),
                IsEmailVerified = true
            };
            var model = new SignInModel
            {
                Email = "test@test.com",
                Password = password
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email && filter.AsNoTracking),
                    It.IsAny<Expression<Func<User, User>>>()))
                .ReturnsAsync(user);

            var controller = CreateInstance();

            // Act
            var result = await controller.SignInAsync(model);

            // Assert
            _userService.Verify(service => service.SignInAsync(userId), Times.Once);
            _authService.Verify(service => service.SetTokensAsync(userId), Times.Once);
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task ForgotPasswordShouldReturnOkWhenUserDoesNotExist()
        {
            // Arrange
            var model = new ForgotPasswordModel
            {
                Email = "test@test.com"
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email && filter.AsNoTracking)))
                .ReturnsAsync((User)null);

            var controller = CreateInstance();

            // Act
            var result = await controller.ForgotPasswordAsync(model);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task ForgotPasswordShouldGenerateAndSendResetPasswordToken()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Email = "test@test.com"
            };
            var model = new ForgotPasswordModel
            {
                Email = user.Email
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email && filter.AsNoTracking),
                    It.IsAny<Expression<Func<User, User>>>()))
                .ReturnsAsync(user);

            var controller = CreateInstance();

            // Act
            var result = await controller.ForgotPasswordAsync(model);

            // Assert
            _userService.Verify(service => service.SetResetPasswordTokenAsync(user.Id), Times.Once);
            _emailService.Verify(service => service.SendForgotPasswordAsync(
                It.Is<ForgotPasswordEmailModel>(m => m.Email == user.Email))
            );

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task ResetPasswordShouldReturnBadRequestWhenTokenIsInvalid()
        {
            // Arrange
            var model = new ResetPasswordModel
            {
                Token = "test token"
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.ResetPasswordToken == model.Token)))
                .ReturnsAsync((User)null);

            var controller = CreateInstance();

            // Act
            var result = await controller.ResetPasswordAsync(model);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task ResetPasswordShouldUpdatePassword()
        {
            // Arrange
            var model = new ResetPasswordModel
            {
                Token = "test token",
                Password = "new password"
            };
            var user = new User
            {
                Id = 1
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.ResetPasswordToken == model.Token && filter.AsNoTracking),
                    It.IsAny<Expression<Func<User, User>>>()))
                .ReturnsAsync(user);

            var controller = CreateInstance();

            // Act
            var result = await controller.ResetPasswordAsync(model);

            // Assert
            _userService.Verify(service => service.UpdatePasswordAsync(user.Id, model.Password));
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task ResendVerificationShouldSendSignUpEmail()
        {
            // Arrange
            var model = new ResendVerificationModel
            {
                Email = "test@test.com"
            };
            var user = new User
            {
                FirstName = "firstName",
                SignupToken = "test token"
            };

            _userService.Setup(service => service.FindOneAsync(
                    It.Is<UserFilter>(filter => filter.Email == model.Email && filter.AsNoTracking),
                    It.IsAny<Expression<Func<User, User>>>()))
                .ReturnsAsync(user);

            var controller = CreateInstance();

            // Act
            var result = await controller.ResendVerificationAsync(model);

            // Assert
            _emailService.Verify(service => service.SendSignUpAsync(
                It.Is<SignUpEmailModel>(m =>
                    m.Email == model.Email &&
                    m.SignUpToken == user.SignupToken &&
                    m.FirstName == user.FirstName
                ))
            );
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task RefreshTokenShouldReturnUnauthorizedWhenTokenIsNotFound()
        {
            // Arrange
            var refreshToken = "refresh token";
            var contextMock = new Mock<HttpContext>();
            contextMock.Setup(context => context.Request.Cookies[Constants.CookieNames.RefreshToken])
                .Returns(refreshToken);

            var controllerContext = new ControllerContext { HttpContext = contextMock.Object };

            _tokenService.Setup(service => service.FindOneAsync(
                    It.Is<TokenFilter>(filter => filter.Value == refreshToken && filter.AsNoTracking)))
                .ReturnsAsync((Token)null);

            var controller = CreateInstance();
            controller.ControllerContext = controllerContext;

            // Act
            var result = await controller.RefreshTokenAsync();

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task RefreshTokenShouldSetToken()
        {
            // Arrange
            var userId = 1;
            var refreshToken = "refresh token";
            var contextMock = new Mock<HttpContext>();
            contextMock.Setup(context => context.Request.Cookies[Constants.CookieNames.RefreshToken])
                .Returns(refreshToken);

            var controllerContext = new ControllerContext { HttpContext = contextMock.Object };

            _tokenService.Setup(service => service.FindOneAsync(
                    It.Is<TokenFilter>(filter => filter.Value == refreshToken && filter.AsNoTracking),
                    It.IsAny<Expression<Func<Token, Token>>>()))
                .ReturnsAsync(new Token
                {
                    UserId = userId,
                    ExpireAt = DateTime.UtcNow.AddYears(1)
                });

            var controller = CreateInstance();
            controller.ControllerContext = controllerContext;

            // Act
            var result = await controller.RefreshTokenAsync();

            // Assert
            _authService.Verify(service => service.SetTokensAsync(userId), Times.Once);
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task LogoutShouldUnsetTokenAndReturnOk()
        {
            // Arrange
            var contextMock = new Mock<HttpContext>();
            var currentUserId = 1;

            contextMock.Setup(context => context.User.Identity.Name).Returns(currentUserId.ToString());
            var controllerContext = new ControllerContext { HttpContext = contextMock.Object };

            var controller = CreateInstance();
            controller.ControllerContext = controllerContext;

            // Act
            var result = await controller.SignOutAsync();

            // Assert
            _authService.Verify(service => service.UnsetTokensAsync(currentUserId), Times.Once);
            Assert.IsType<OkResult>(result);
        }

        private AccountController CreateInstance()
        {
            _appSettingsOptions.Setup(options => options.Value)
                .Returns(_appSettings);

            return new AccountController(
                _authService.Object,
                _emailService.Object,
                _userService.Object,
                _tokenService.Object,
                _environment.Object,
                _appSettingsOptions.Object,
                _mapper.Object);
        }
    }
}
