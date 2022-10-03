using Common.Enums;

namespace Api.NoSql.Services.Interfaces;

public interface IAuthService
{
    Task SetTokensAsync(string userId, UserRole userRole);
    Task UnsetTokensAsync(string userId);
}