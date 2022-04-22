using Api.NoSql.Middleware;

namespace Api.NoSql.Utils;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseTokenAuthentication(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<TokenAuthenticationMiddleware>();
    }
}