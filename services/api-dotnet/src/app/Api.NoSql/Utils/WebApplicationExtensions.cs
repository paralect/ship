using Common;
using Common.Settings;
using Hangfire;
using Hangfire.Dashboard.BasicAuthorization;

namespace Api.NoSql.Utils;

internal static class WebApplicationExtensions
{
    public static void UseHangfireDashboard(this WebApplication app, AppSettings appSettings)
    {
        app.UseHangfireDashboard(
            pathMatch: Constants.HangfireDashboardPath,
            options: new DashboardOptions
            {
                Authorization = new[]
                {
                    new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
                    {
                        RequireSsl = false,
                        SslRedirect = false,
                        LoginCaseSensitive = true,
                        Users = new[]
                        {
                            new BasicAuthAuthorizationUser
                            {
                                Login = appSettings.HangfireDashboard.Username,
                                PasswordClear = appSettings.HangfireDashboard.Password
                            }
                        }
                    })
                }
            });
    }
}