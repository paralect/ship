using Api.NoSql.Services.Interfaces;
using Common;
using Common.Enums;
using Common.Services.NoSql.Domain.Interfaces;
using Common.Settings;
using Microsoft.Extensions.Options;

namespace Api.NoSql.Services;

public class AuthService : IAuthService
{
    private readonly ITokenService _tokenService;
    private readonly AppSettings _appSettings;
    private readonly HttpContext _httpContext;

    public AuthService(
        ITokenService tokenService,
        IOptions<AppSettings> appSettings,
        IHttpContextAccessor httpContextAccessor
        )
    {
        _tokenService = tokenService;
        _appSettings = appSettings.Value;
        _httpContext = httpContextAccessor.HttpContext;
    }

    public async Task SetTokensAsync(string userId, UserRole userRole)
    {
        var accessToken = await _tokenService.CreateAccessToken(userId, userRole);

        var domain = _appSettings.CookieDomain ?? new Uri(_appSettings.WebUrl).Host;

        _httpContext.Response.Cookies.Append(Constants.CookieNames.AccessToken, accessToken.Value, new CookieOptions
        {
            HttpOnly = false,
            Expires = accessToken.ExpireAt,
            Domain = domain
        });
    }

    public async Task UnsetTokensAsync(string userId)
    {
        await _tokenService.DeleteAccessTokens(userId);

        _httpContext.Response.Cookies.Delete(Constants.CookieNames.AccessToken);
    }
}