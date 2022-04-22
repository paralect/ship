namespace Api.Views.Models.Infrastructure.Email;

public class ForgotPasswordEmailModel
{
    public string Email { get; set; }
    public string ResetPasswordToken { get; set; }
    public string FirstName { get; set; }
}
