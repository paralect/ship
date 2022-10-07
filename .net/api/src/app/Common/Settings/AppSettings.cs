namespace Common.Settings;

public class AppSettings
{
    public string ApiUrl { get; set; }
    public string WebUrl { get; set; }
    public string WsUrl { get; set; }
    public string CookieDomain { get; set; }
    public HangfireDashboardSettings HangfireDashboard { get; set; }
}

public class HangfireDashboardSettings
{
    public string Username { get; set; }
    public string Password { get; set; }
}