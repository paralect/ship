using Api.NoSql.Middleware;
using Common;

namespace Api.NoSql.Utils;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseTokenAuthentication(this IApplicationBuilder builder)
    {
        builder.UseWhen(
            context => !context.Request.Path.Equals(Constants.HealthcheckPath),
            x => x.UseMiddleware<TokenAuthenticationMiddleware>()
        );

        return builder;
    }
}