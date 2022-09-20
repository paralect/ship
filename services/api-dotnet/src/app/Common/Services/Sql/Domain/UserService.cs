using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.DalSql.Interfaces;
using Common.Enums;
using Common.Models.Infrastructure.Email;
using Common.Models.View.Account;
using Common.Services.Infrastructure.Interfaces;
using Common.Services.Sql.Domain.Interfaces;
using Common.Utils;

namespace Common.Services.Sql.Domain;

public class UserService : BaseEntityService<User, UserFilter>, IUserService
{
    private readonly IEmailService _emailService;
    private readonly ICloudStorageService _cloudStorageService;
    private readonly IUserRepository _userRepository;

    public UserService(
        IEmailService emailService,
        ICloudStorageService cloudStorageService,
        IUserRepository userRepository)
        : base(userRepository)
    {
        _emailService = emailService;
        _cloudStorageService = cloudStorageService;
        _userRepository = userRepository;
    }

    public async Task<User> CreateUserAccountAsync(SignUpModel model)
    {
        var signUpToken = SecurityUtils.GenerateSecureToken();

        var user = new User
        {
            Role = UserRole.User,
            FirstName = model.FirstName,
            LastName = model.LastName,
            PasswordHash = model.Password.GetHash(),
            Email = model.Email,
            IsEmailVerified = false,
            SignupToken = signUpToken
        };

        await _userRepository.InsertAsync(user);

        await _emailService.SendSignUpAsync(new SignUpEmailModel
        {
            Email = model.Email,
            FirstName = model.FirstName,
            SignUpToken = signUpToken
        });

        return user;
    }

    public async Task VerifyEmailAsync(long id)
    {
        await _userRepository.UpdateOneAsync(id, x =>
        {
            x.IsEmailVerified = true;
            x.LastRequest = DateTime.UtcNow;
        });
    }

    public async Task SignInAsync(long id)
    {
        await _userRepository.UpdateOneAsync(id, x =>
        {
            x.LastRequest = DateTime.UtcNow;
        });
    }

    public async Task<string> SetResetPasswordTokenAsync(long id)
    {
        var user = await _userRepository.FindOneAsync(new UserFilter
        {
            Id = id
        },
        x => new
        {
            x.ResetPasswordToken
        });

        if (user.ResetPasswordToken.HasNoValue())
        {
            await _userRepository.UpdateOneAsync(id, x =>
            {
                x.ResetPasswordToken = SecurityUtils.GenerateSecureToken();
            });
        }

        return user.ResetPasswordToken;
    }

    public async Task UpdateAvatarAsync(long id, string fileName, Stream file)
    {
        var avatarUrl = await _cloudStorageService.UploadPublicAsync(
            $"avatars/{id}-{DateTime.UtcNow:s}-{fileName}",
            file
        );

        await _userRepository.UpdateOneAsync(id, x =>
        {
            x.AvatarUrl = avatarUrl;
        });
    }

    public async Task RemoveAvatarAsync(long id)
    {
        await _userRepository.UpdateOneAsync(id, x =>
        {
            x.AvatarUrl = null;
        });
    }

    public async Task UpdatePasswordAsync(long id, string newPassword)
    {
        await _userRepository.UpdateOneAsync(id, x =>
        {
            x.PasswordHash = newPassword.GetHash();
            x.ResetPasswordToken = null;
        });
    }
}