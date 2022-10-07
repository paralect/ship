using MongoDB.Driver;

namespace Common;

public static class Constants
{
    public static class DbDocuments
    {
        public const string Users = "users";
        public const string Tokens = "tokens";
    }

    public const int TokenSecurityLength = 32;
    public const string AuthenticationScheme = "Token";

    public static class CookieNames
    {
        public const string AccessToken = "access_token";
    }

    public static class Swagger
    {
        public const string Url = "/swagger/v1/swagger.json";
        public const string Name = "My API V1";
        public const string Version = "v1";
    }

    public static class CorsPolicy
    {
        public const string AllowSpecificOrigin = "AllowSpecificOrigin";
    }

    public static readonly Collation DefaultCollation = new Collation("en", strength: CollationStrength.Primary);
    public static string HealthcheckPath = "/health";
    public static string HangfireDashboardPath = "/hangfire";
}
