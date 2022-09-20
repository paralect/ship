using Common.Models.View.User;

namespace SignalR.Hubs
{
    public interface IUserHubContext
    {
        Task SendUpdateAsync(UserViewModel model);
    }
}
