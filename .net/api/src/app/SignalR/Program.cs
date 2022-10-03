using Common;
using Common.Dal;
using Common.Settings;
using Common.Utils;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;
using SignalR.Hubs;
using SignalR.Utils;

var builder = WebApplication.CreateBuilder(args);
var environment = builder.Environment;
var configuration = builder.Configuration;
var services = builder.Services;

builder.Host.UseSerilog();
Log.Logger = environment.BuildLogger();

var dbSettings = services.AddSettings<DbSettings>(configuration, "Db");
var appSettings = services.AddSettings<AppSettings>(configuration, "App");
services.AddSettings<TokenExpirationSettings>(configuration, "TokenExpiration");
services.AddSettings<EmailSettings>(configuration, "Email");

services.AddDiConfiguration();
services.AddCors(appSettings);
services.AddHttpContextAccessor();
services.AddSignalR();
services.AddHealthChecks(dbSettings);
services.InitializeDb(dbSettings);
services.AddControllers();

var app = builder.Build();

if (environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseSerilogRequestLogging();
app.UseRouting();
app.UseCors(Constants.CorsPolicy.AllowSpecificOrigin);
app.UseTokenAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<UserHub>(string.Empty);
    endpoints.MapHealthChecks(Constants.HealthcheckPath, new HealthCheckOptions
    {
        AllowCachingResponses = false
    });
});

try
{
    Log.Information("Starting web host");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}