namespace Common.Jobs;

public interface ISchedulerRecurringJob
{
    Task ExecuteAsync();
}