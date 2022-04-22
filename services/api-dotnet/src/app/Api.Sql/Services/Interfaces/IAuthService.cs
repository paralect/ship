namespace Api.Sql.Services.Interfaces;

public interface IAuthService
{
    Task SetTokensAsync(long userId);
    Task UnsetTokensAsync(long userId);
}
