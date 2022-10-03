using Common.DalSql;

namespace Api.Sql.Middleware
{
    public class DbContextSaveChangesMiddleware
    {
        private readonly RequestDelegate _next;

        public DbContextSaveChangesMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ShipDbContext dbContext)
        {
            await _next(context);
            await dbContext.SaveChangesAsync();
        }
    }
}
