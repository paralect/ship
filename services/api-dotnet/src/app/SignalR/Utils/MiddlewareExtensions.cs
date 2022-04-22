using SignalR.Middleware;

namespace SignalR.Utils;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseTokenAuthentication(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<TokenAuthenticationMiddleware>();
    }
}