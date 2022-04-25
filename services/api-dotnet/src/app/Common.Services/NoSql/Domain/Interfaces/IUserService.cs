using Api.Views.Models.View.Account;
using Common.Dal.Documents.User;
using Common.Dal.Repositories;

namespace Common.Services.NoSql.Domain.Interfaces;

public interface IUserService : IDocumentService<User, UserFilter>
{
    Task<User> FindByEmailAsync(string email);
    Task<bool> IsEmailInUseAsync(string userIdToExclude, string email);

    Task<User> CreateUserAccountAsync(SignUpModel model);

    Task UpdateLastRequestAsync(string id);
    Task UpdateResetPasswordTokenAsync(string id, string token);
    Task UpdatePasswordAsync(string id, string newPassword);
    Task MarkEmailAsVerifiedAsync(string id);
}
