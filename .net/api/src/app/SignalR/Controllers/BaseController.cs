using Microsoft.AspNetCore.Mvc;

namespace SignalR.Controllers;

[ApiController]
[Route("[controller]")]
public abstract class BaseController : ControllerBase
{
}