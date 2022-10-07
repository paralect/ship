using Common.DalSql;
using Common.Settings;
using Common.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Formatting.Compact;

using var host = createHostBuilder(args).Build();

Log.Logger = buildLogger();

try
{
    using var serviceScope = host.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
    var context = serviceScope.ServiceProvider.GetRequiredService<ShipDbContext>();
    await context.Database.MigrateAsync();
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
            var dbSettings = services.AddSettings<DbSettings>(context.Configuration, "Db");
            services.InitializeDb(dbSettings);
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