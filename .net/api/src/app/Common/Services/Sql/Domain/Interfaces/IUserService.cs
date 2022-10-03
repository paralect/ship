using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.Models.View.Account;

namespace Common.Services.Sql.Domain.Interfaces;

public interface IUserService : IEntityService<User, UserFilter>
{
    Task<User> CreateUserAccountAsync(SignUpModel model);

    Task VerifyEmailAsync(long id);
    Task SignInAsync(long id);
    Task UpdatePasswordAsync(long id, string newPassword);
    Task<string> SetResetPasswordTokenAsync(long id);
    Task UpdateAvatarAsync(long id, string fileName, Stream file);
    Task RemoveAvatarAsync(long id);
}
