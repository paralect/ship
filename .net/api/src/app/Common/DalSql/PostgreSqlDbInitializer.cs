using Common.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Common.DalSql;

public static class PostgreSqlDbInitializer
{
    public static void InitializeDb(this IServiceCollection services, DbSettings settings)
    {
        services.AddDbContext<ShipDbContext>(options =>
            options
                .UseNpgsql(settings.ConnectionStrings.Api,
                    contextBuilder => contextBuilder.MigrationsAssembly("Migrator.Sql"))
        );
    }
}
