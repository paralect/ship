using Microsoft.AspNetCore.SignalR;

namespace SignalR.Hubs
{
    public class UserHub : Hub
    {
        // This method is required to unify interaction with the client application.
        // The client can use SignalR or Socket.IO as event-based communication library.
        // In Socket.IO after a connection is established, the client expects to receive a "connect" message.
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("connect");
        }

        public async Task Subscribe(string groupName)
        {
            if (HasAccessToRoom(groupName))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            }
        }

        private bool HasAccessToRoom(string groupName)
        {
            return groupName == $"user-{Context.User.Identity.Name}";
        }
    }
}