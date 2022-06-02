using Scheduler.Settings.JobConfigs;

namespace Scheduler.Settings;

public class SchedulerSettings
{
    public Jobs Jobs { get; set; }
}

public class Jobs
{
    public HelloWorldJobConfig HelloWorld { get; set; }
}