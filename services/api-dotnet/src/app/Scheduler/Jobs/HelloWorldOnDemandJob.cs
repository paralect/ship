using Common.Jobs;

namespace Scheduler.Jobs;

public class HelloWorldOnDemandJob : IHelloWorldOnDemandJob
{
    public void SayHello()
    {
        Console.WriteLine("Hello world (on demand)");
    }
}