using Common.Jobs;

namespace Scheduler.Jobs;

public class HelloWorldRecurringJob : IHelloWorldRecurringJob
{
    public async Task ExecuteAsync()
    {
        Console.WriteLine("Hello world (recurring)");
        await Task.CompletedTask;
    }
}