namespace Common.Settings;

public class CacheSettings
{
    public bool IsEnabled { get; set; }
    public string ConnectionString { get; set; }
    public int AbsoluteExpirationInSeconds { get; set; }
    public int SlidingExpirationInSeconds { get; set; }
}
