using System.Text.Json.Serialization;

namespace Api.Views.Models.View.User;

public class UserViewModel
{
    [JsonPropertyName("_id")]
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}
