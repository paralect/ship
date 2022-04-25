using Api.NoSql.Services.Interfaces;
using Common;
using Common.Caching;
using Common.Caching.Interfaces;
using Common.Dal;
using Common.Dal.Interfaces;
using Common.Services.NoSql.Domain.Interfaces;
using Common.Settings;
using Common.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using ValidationAttribute = Api.NoSql.Security.ValidationAttribute;

namespace Api.NoSql.Utils;

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
        //     new List<Type> { typeof(IAuthService), typeof(IUserService) },
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
            new List<Type> { typeof(IAuthService), typeof(IUserService) },
            predicate,
            predicate
        );

        services.AddTransient<IDbContext, DbContext>();

        services.AddTransient<IIdGenerator, IdGenerator>();
    }

    public static void AddCors(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(Constants.CorsPolicy.AllowSpecificOrigin, builder =>
            {
                builder
                    .WithOrigins(appSettings.LandingUrl, appSettings.WebUrl)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }

    public static void AddApiControllers(this IServiceCollection services)
    {
        services
            .AddControllers(o => o.Filters.Add(typeof(ValidationAttribute)))
            .ConfigureApiBehaviorOptions(o =>
            {
                o.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState.GetErrors();
                    var result = new BadRequestObjectResult(errors);

                    return result;
                };
            });
    }

    public static void AddCache(this IServiceCollection services, CacheSettings cacheSettings)
    {
        services.AddStackExchangeRedisCache(options => options.Configuration = cacheSettings.ConnectionString);

        services.AddTransient<ICache, Cache>();
    }

    public static void AddSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc(Constants.Swagger.Version,
                new OpenApiInfo { Title = Constants.Swagger.Name, Version = Constants.Swagger.Version });
        });
    }

    public static void AddHealthChecks(this IServiceCollection services, DbSettings dbSettings, CacheSettings cacheSettings)
    {
        var builder = services.AddHealthChecks();

        builder.AddMongoDb(
            mongodbConnectionString: dbSettings.ConnectionStrings.Api,
            mongoDatabaseName: dbSettings.ApiDatabase
        );

        if (cacheSettings.IsEnabled)
        {
            builder.AddRedis(cacheSettings.ConnectionString);
        }
    }
}