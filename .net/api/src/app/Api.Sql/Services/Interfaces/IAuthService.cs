namespace Api.Sql.Services.Interfaces;

public interface IAuthService
{
    Task SetTokenAsync(long userId);
    Task UnsetTokensAsync(long userId);
}
