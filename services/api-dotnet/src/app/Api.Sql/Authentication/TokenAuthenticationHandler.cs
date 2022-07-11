using System.Security.Claims;
using System.Text.Encodings.Web;
using Common;
using Common.DalSql.Filters;
using Common.DalSql.Interfaces;
using Common.Enums;
using Common.Utils;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace Api.Sql.Authentication;

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
        
        var token = await _tokenRepository.FindOneAsync(
            new TokenFilter
            {
                Value = accessToken,
                AsNoTracking = true
            },
            x => new UserTokenModel
            {
                UserId = x.UserId,
                UserRole = x.User.Role,
                ExpireAt = x.ExpireAt
            });

        if (token == null || token.IsExpired())
        {
            return AuthenticateResult.Fail("Token not found");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, token.UserId.ToString()),
            new Claim(ClaimTypes.Role, token.UserRole.ToString())
        };
        var claimsIdentity = new ClaimsIdentity(claims, nameof(TokenAuthenticationHandler));
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(claimsIdentity), Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}

public class UserTokenModel : IExpirable
{
    public long UserId { get; set; }
    public UserRole UserRole { get; set; }
    public DateTime ExpireAt { get; set; }
}