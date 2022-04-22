namespace Common.Settings;

public class TokenExpirationSettings
{
    public int AccessTokenExpiresInHours { get; set; }
    public int RefreshTokenExpiresInHours { get; set; }
}
