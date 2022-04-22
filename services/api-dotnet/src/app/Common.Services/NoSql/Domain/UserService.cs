using Api.Views.Models.Infrastructure.Email;
using Api.Views.Models.View.Account;
using Common.Dal.Documents.User;
using Common.Dal.FluentUpdater;
using Common.Dal.Interfaces;
using Common.Dal.Repositories;
using Common.Enums;
using Common.Services.Infrastructure.Interfaces;
using Common.Services.NoSql.Domain.Interfaces;
using Common.Utils;

namespace Common.Services.NoSql.Domain;

public class UserService : BaseDocumentService<User, UserFilter>, IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;

    public UserService(IUserRepository userRepository,
        IEmailService emailService) : base(userRepository)
    {
        _userRepository = userRepository;
        _emailService = emailService;
    }

    public async Task<User> FindByEmailAsync(string email)
    {
        return await FindOneAsync(new UserFilter { Email = email });
    }

    public async Task MarkEmailAsVerifiedAsync(string id)
    {
        await _userRepository.UpdateOneAsync(id, u => u.IsEmailVerified, true);
    }

    public async Task UpdateLastRequestAsync(string id)
    {
        await _userRepository.UpdateOneAsync(id, u => u.LastRequest, DateTime.UtcNow);
    }

    public async Task UpdateResetPasswordTokenAsync(string id, string token)
    {
        await _userRepository.UpdateOneAsync(id, u => u.ResetPasswordToken, token);
    }

    public async Task UpdatePasswordAsync(string id, string newPassword)
    {
        await _userRepository.UpdateOneAsync(id, Updater<User>
            .Set(u => u.PasswordHash, newPassword.GetHash())
            .Set(u => u.ResetPasswordToken, null));
    }

    public async Task<User> CreateUserAccountAsync(SignUpModel model)
    {
        var signUpToken = SecurityUtils.GenerateSecureToken();

        var newUser = new User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            PasswordHash = model.Password.GetHash(),
            Email = model.Email,
            IsEmailVerified = false,
            SignupToken = signUpToken,
            Role = UserRole.User
        };

        await _userRepository.InsertAsync(newUser);

        await _emailService.SendSignUpAsync(new SignUpEmailModel
        {
            Email = model.Email,
            FirstName = model.FirstName,
            SignUpToken = signUpToken
        });

        return newUser;
    }

    public async Task<bool> IsEmailInUseAsync(string userIdToExclude, string email)
    {
        var user = await _userRepository
            .FindOneAsync(new UserFilter { UserIdToExclude = userIdToExclude, Email = email });

        return user != null;
    }
}
