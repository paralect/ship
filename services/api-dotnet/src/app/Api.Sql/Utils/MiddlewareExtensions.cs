using Api.Sql.Middleware;

namespace Api.Sql.Utils;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseTokenAuthentication(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<TokenAuthenticationMiddleware>();
    }

    /// <summary>
    /// The middleware makes requests to DB, if there are any changes on EF DbContext.
    /// It's still possible to update DB manually from controllers/services - in this case the middleware does nothing
    /// </summary>
    public static IApplicationBuilder UseDbContextSaveChanges(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<DbContextSaveChangesMiddleware>();
    }
}
