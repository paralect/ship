using Common.Models.View.User;
using Microsoft.AspNetCore.SignalR;

namespace SignalR.Hubs
{
    public class UserHubContext : IUserHubContext
    {
        private readonly IHubContext<UserHub> _hubContext;

        public UserHubContext(IHubContext<UserHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendUpdateAsync(UserViewModel model)
        {
            var groupName = $"user-{model.Id}";
            await _hubContext.Clients.Group(groupName).SendAsync("user:updated", model);
        }
    }
}
