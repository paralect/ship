using System.Security.Principal;
using Common;
using Common.DalSql.Filters;
using Common.DalSql.Interfaces;
using Common.Enums;
using Common.Middleware;
using Common.Utils;

namespace Api.Sql.Middleware;

public class TokenAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public TokenAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, ITokenRepository tokenRepository)
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
                var token = await tokenRepository.FindOneAsync(new TokenFilter
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

                if (token != null && !token.IsExpired())
                {
                    var principal = new Principal(
                        new GenericIdentity(token.UserId.ToString()),
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

public class UserTokenModel : IExpirable
{
    public long UserId { get; set; }
    public UserRole UserRole { get; set; }
    public DateTime ExpireAt { get; set; }
}