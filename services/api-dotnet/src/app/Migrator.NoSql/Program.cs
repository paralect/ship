using System.Reflection;
using Common.Settings;
using Common.Utils;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Migrator.NoSql.Migrations;
using MongoDBMigrations;
using Serilog;
using Serilog.Formatting.Compact;

using var host = createHostBuilder(args).Build();

Log.Logger = buildLogger();

var dbSettings = host.Services.GetRequiredService<IOptions<DbSettings>>().Value;

try
{
    var result = new MigrationEngine()
        .UseDatabase(dbSettings.ConnectionStrings.Api, dbSettings.ApiDatabase)
        .UseAssembly(Assembly.GetAssembly(typeof(M_001_DemoInsertTestDocument)))
        .UseSchemeValidation(false)
        .Run();

    if (result.InterimSteps.Any())
    {
        foreach (var step in result.InterimSteps)
        {
            Log.Information(
                $"Step {step.CurrentNumber}: migration to version '{step.TargetVersion}' ('{step.MigrationName}')");
        }

        Log.Information($"Migration is completed. Current version: '{result.CurrentVersion}'");
    }
    else
    {
        Log.Information("No migrations to apply");
    }
}
catch (Exception ex)
{
    Log.Fatal(ex, "Failed to apply migrations");
}
finally
{
    Log.CloseAndFlush();
}

IHostBuilder createHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .UseSerilog()
        .ConfigureServices((context, services) =>
        {
            services.AddSettings<DbSettings>(context.Configuration, "Db");
        });

ILogger buildLogger()
{
    var loggerConfig = new LoggerConfiguration()
        .MinimumLevel.Information()
        .Enrich.FromLogContext()
        .WriteTo.Logger(lc =>
        {
            var hostEnvironment = host.Services.GetRequiredService<IHostEnvironment>();
            if (hostEnvironment.IsDevelopment())
            {
                lc.WriteTo.Console();
            }
            else
            {
                lc.WriteTo.Console(new RenderedCompactJsonFormatter());
            }
        });

    return loggerConfig.CreateLogger();
}