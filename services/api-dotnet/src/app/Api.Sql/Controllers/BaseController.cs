using Common.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Api.Sql.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public abstract class BaseController : ControllerBase
    {
        protected long? CurrentUserId
        {
            get
            {
                var currentUserId = User?.Identity?.Name;
                return currentUserId.HasValue()
                    ? long.Parse(currentUserId)
                    : null;
            }
        }

        protected BadRequestResult BadRequest(string field, string errorMessage)
        {
            ModelState.AddModelError(field, errorMessage);
            return BadRequest();
        }
    }
}