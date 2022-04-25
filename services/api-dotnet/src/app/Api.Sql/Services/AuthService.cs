using Api.Sql.Services.Interfaces;
using Common;
using Common.Services.Sql.Domain.Interfaces;
using Common.Settings;
using Microsoft.Extensions.Options;

namespace Api.Sql.Services;

public class AuthService : IAuthService
{
    private readonly AppSettings _appSettings;
    private readonly HttpContext _httpContext;
    private readonly ITokenService _tokenService;

    public AuthService(
        IOptions<AppSettings> appSettings,
        IHttpContextAccessor httpContextAccessor,
        ITokenService tokenService)
    {
        _tokenService = tokenService;
        _appSettings = appSettings.Value;
        _httpContext = httpContextAccessor.HttpContext;
    }

    public async Task SetTokensAsync(long userId)
    {
        var (accessToken, refreshToken) = await _tokenService.CreateAuthTokens(userId);

        var domain = new Uri(_appSettings.WebUrl).Host;

        _httpContext.Response.Cookies.Append(Constants.CookieNames.AccessToken, accessToken.Value, new CookieOptions
        {
            HttpOnly = false,
            Expires = accessToken.ExpireAt,
            Domain = domain
        });

        _httpContext.Response.Cookies.Append(Constants.CookieNames.RefreshToken, refreshToken.Value, new CookieOptions
        {
            HttpOnly = true,
            Expires = refreshToken.ExpireAt,
            Domain = domain
        });
    }

    public async Task UnsetTokensAsync(long userId)
    {
        await _tokenService.DeleteAuthTokens(userId);

        _httpContext.Response.Cookies.Delete(Constants.CookieNames.AccessToken);
        _httpContext.Response.Cookies.Delete(Constants.CookieNames.RefreshToken);
    }
}
