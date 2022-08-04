using Common.Models.View.User;
using Microsoft.AspNetCore.Mvc;
using SignalR.Hubs;

namespace SignalR.Controllers;

public class UsersController : BaseController
{
    private readonly IUserHubContext _userHubContext;

    public UsersController(IUserHubContext userHubContext)
    {
        _userHubContext = userHubContext;
    }

    [HttpPost]
    public async Task<IActionResult> Update(UserViewModel model)
    {
        await _userHubContext.SendUpdateAsync(model);
        
        return Ok();
    }
}
