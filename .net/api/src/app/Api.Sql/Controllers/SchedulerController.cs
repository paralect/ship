using Common.Jobs;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace Api.Sql.Controllers;

public class SchedulerController : BaseController
{
    /// <summary>
    /// Demonstrates, how to trigger a background job on demand
    /// </summary>
    [HttpPost("say-hello")]
    public IActionResult SayHello()
    {
        BackgroundJob.Enqueue<IHelloWorldOnDemandJob>(x => x.SayHello());

        return Ok();
    }
}
