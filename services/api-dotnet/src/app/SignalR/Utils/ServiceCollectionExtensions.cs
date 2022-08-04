using Common;
using Common.Dal;
using Common.Dal.Interfaces;
using Common.Services.NoSql.Domain.Interfaces;
using Common.Settings;
using Common.Utils;
using SignalR.Hubs;

namespace SignalR.Utils;

internal static class ServiceCollectionExtensions
{
    public static void AddDiConfiguration(this IServiceCollection services)
    {
        // replace with simpler version, if SQL DAL is removed from the solution:
        // services.AddTransientByConvention(
        //     typeof(IRepository<,>),
        //     t => t.Name.EndsWith("Repository")
        // );

        // services.AddTransientByConvention(
        //     typeof(IUserService),
        //     t => t.Name.EndsWith("Service")
        // );

        services.AddTransientByConvention(
            new List<Type> { typeof(IRepository<,>) },
            t => t.Namespace.StartsWith("Common.Dal.") && t.Name.EndsWith("Repository"),
            t => t.Namespace.StartsWith("Common.Dal.") && t.Name.EndsWith("Repository")
        );

        Predicate<Type> predicate = t =>
            !t.Namespace.StartsWith("Common.Services.Sql.") // filter out SQL services
            && t.Name.EndsWith("Service");

        services.AddTransientByConvention(
            new List<Type> { typeof(IUserService) },
            predicate,
            predicate
        );

        services.AddTransient<IDbContext, DbContext>();
        services.AddTransient<IIdGenerator, IdGenerator>();

        services.AddTransient<IUserHubContext, UserHubContext>();
    }

    public static void AddCors(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(Constants.CorsPolicy.AllowSpecificOrigin, builder =>
            {
                builder
                    .WithOrigins(appSettings.WebUrl)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }

    public static void AddHealthChecks(this IServiceCollection services, DbSettings dbSettings)
    {
        var builder = services.AddHealthChecks();

        builder.AddMongoDb(
            mongodbConnectionString: dbSettings.ConnectionStrings.Api,
            mongoDatabaseName: dbSettings.ApiDatabase
        );
    }
}