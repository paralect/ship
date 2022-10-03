using System.Text.Json.Serialization;

namespace Common.Models.View.User;

public class UserViewModel
{
    [JsonPropertyName("_id")]
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string AvatarUrl { get; set; }
}