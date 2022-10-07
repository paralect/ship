using System.Security.Claims;
using System.Text.Encodings.Web;
using Common;
using Common.Dal.Interfaces;
using Common.Dal.Repositories;
using Common.Utils;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Api.NoSql.Authentication;

public class TokenAuthenticationHandler : AuthenticationHandler<TokenAuthenticationSchemeOptions>
{
    private readonly ITokenRepository _tokenRepository;
    
    public TokenAuthenticationHandler(
        IOptionsMonitor<TokenAuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        ITokenRepository tokenRepository) : base(options, logger, encoder, clock)
    {
        _tokenRepository = tokenRepository;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var accessToken = Request.Cookies[Constants.CookieNames.AccessToken];
        if (accessToken.HasNoValue())
        {
            var authorization = Request.Headers["Authorization"].ToString();
            if (authorization.HasValue())
            {
                accessToken = authorization.Replace("Bearer", "").Trim();
            }
        }
        
        if (accessToken.HasNoValue())
        {
            return AuthenticateResult.Fail("Token not found");
        }
        
        var token = await _tokenRepository.FindOneAsync(new TokenFilter { Value = accessToken });
        if (token == null || token.IsExpired())
        {
            return AuthenticateResult.Fail("Token not found");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, token.UserId),
            new Claim(ClaimTypes.Role, token.UserRole.ToString())
        };
        var claimsIdentity = new ClaimsIdentity(claims, nameof(TokenAuthenticationHandler));
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(claimsIdentity), Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}