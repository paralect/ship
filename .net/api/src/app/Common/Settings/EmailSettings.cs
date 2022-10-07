namespace Common.Settings;

public class EmailSettings
{
    public bool UseMock { get; set; }
    public string RedirectToEmail { get; set; }
    public string Host { get; set; }
    public int Port { get; set; }
}