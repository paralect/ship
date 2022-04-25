using Common.Dal.Documents.User;

namespace SignalR.Hubs
{
    public interface IUserHubContext
    {
        Task SendUpdateAsync(User user);
    }
}
