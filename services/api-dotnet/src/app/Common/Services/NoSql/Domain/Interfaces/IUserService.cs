using Common.Dal.Documents.User;
using Common.Dal.Repositories;
using Common.Models.View.Account;

namespace Common.Services.NoSql.Domain.Interfaces;

public interface IUserService : IDocumentService<User, UserFilter>
{
    Task<User> FindByEmailAsync(string email);
    Task<bool> IsEmailInUseAsync(string userIdToExclude, string email);

    Task<User> CreateUserAccountAsync(SignUpModel model);

    Task UpdateLastRequestAsync(string id);
    Task UpdateResetPasswordTokenAsync(string id, string token);
    Task UpdatePasswordAsync(string id, string newPassword);
    Task UpdateAvatarAsync(string id, string fileName, Stream file);
    Task RemoveAvatarAsync(string id);
    Task MarkEmailAsVerifiedAsync(string id);
}
