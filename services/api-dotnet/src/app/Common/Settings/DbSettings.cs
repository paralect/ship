namespace Common.Settings;

public class DbSettings
{
    public ConnectionStrings ConnectionStrings { get; set; }
    public string ApiDatabase { get; set; }
}

public class ConnectionStrings
{
    public string Api { get; set; }
    public string Scheduler { get; set; }
}