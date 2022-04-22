using Scheduler.Settings.JobConfigs;

namespace Scheduler.Settings;

public class SchedulerSettings
{
    public HangfireStorage Storage { get; set; }
    public Jobs Jobs { get; set; }
}

public enum HangfireStorage : byte
{
    MongoDb = 0,
    PostgreSql = 1
}

public class Jobs
{
    public HelloWorldJobConfig HelloWorld { get; set; }
}