namespace Common.Models.Infrastructure.Email;

public class SignUpEmailModel
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string SignUpToken { get; set; }
}
