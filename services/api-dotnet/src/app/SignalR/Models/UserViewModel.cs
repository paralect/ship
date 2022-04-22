using System.Text.Json.Serialization;

namespace SignalR.Models
{
    public class UserViewModel
    {
        [JsonPropertyName("_id")]
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }
}