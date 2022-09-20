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

    public async Task SetTokenAsync(long userId)
    {
        var accessToken = await _tokenService.CreateAccessToken(userId);

        var domain = _appSettings.CookieDomain ?? new Uri(_appSettings.WebUrl).Host;

        _httpContext.Response.Cookies.Append(Constants.CookieNames.AccessToken, accessToken.Value, new CookieOptions
        {
            HttpOnly = false,
            Expires = accessToken.ExpireAt,
            Domain = domain
        });
    }

    public async Task UnsetTokensAsync(long userId)
    {
        await _tokenService.DeleteAccessTokens(userId);

        _httpContext.Response.Cookies.Delete(Constants.CookieNames.AccessToken);
    }
}
