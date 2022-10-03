using Microsoft.AspNetCore.Mvc;

namespace Api.NoSql.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public abstract class BaseController : ControllerBase
    {
        protected string CurrentUserId => User?.Identity?.Name;

        protected BadRequestResult BadRequest(string field, string errorMessage)
        {
            ModelState.AddModelError(field, errorMessage);
            return BadRequest();
        }
    }
}
