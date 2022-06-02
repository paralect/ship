using Common;
using SignalR.Middleware;

namespace SignalR.Utils;

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