using System.Security.Principal;
using Common;
using Common.Dal.Interfaces;
using Common.Dal.Repositories;
using Common.Enums;
using Common.Middleware;
using Common.Utils;

namespace Api.NoSql.Middleware;

public class TokenAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ITokenRepository _tokenRepository;

    public TokenAuthenticationMiddleware(RequestDelegate next, ITokenRepository tokenRepository)
    {
        _next = next;
        _tokenRepository = tokenRepository;
    }

    public async Task Invoke(HttpContext context)
    {
        if (!context.Request.Path.Equals(Constants.HealthcheckPath))
        {
            var accessToken = context.Request.Cookies[Constants.CookieNames.AccessToken];
            if (accessToken.HasNoValue())
            {
                var authorization = context.Request.Headers["Authorization"].ToString();
                if (authorization.HasValue())
                {
                    accessToken = authorization.Replace("Bearer", "").Trim();
                }
            }

            if (accessToken.HasValue())
            {
                var token = await _tokenRepository.FindOneAsync(new TokenFilter
                {
                    Value = accessToken
                });

                if (token != null && !token.IsExpired())
                {
                    var principal = new Principal(
                        new GenericIdentity(token.UserId),
                        new string[]
                        {
                            Enum.GetName(typeof(UserRole), token.UserRole)
                        }
                    );

                    Thread.CurrentPrincipal = principal;
                    context.User = principal;
                }
            }
        }

        await _next(context);
    }
}