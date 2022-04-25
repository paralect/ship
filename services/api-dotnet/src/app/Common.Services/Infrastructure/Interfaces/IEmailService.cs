using Api.Views.Models.Infrastructure.Email;

namespace Common.Services.Infrastructure.Interfaces;

public interface IEmailService
{
    Task SendSignUpAsync(SignUpEmailModel model);
    Task SendForgotPasswordAsync(ForgotPasswordEmailModel model);
}
