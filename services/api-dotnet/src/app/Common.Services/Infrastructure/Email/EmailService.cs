using Api.Views.Models.Infrastructure.Email;
using Common.Services.Infrastructure.Interfaces;
using Common.Settings;
using Common.Utils;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Common.Services.Infrastructure.Email;

public class EmailService : IEmailService
{
    private readonly ILogger _logger;
    private readonly EmailSettings _emailSettings;
    private readonly AppSettings _appSettings;

    public EmailService(
        ILogger<EmailService> logger,
        IOptions<EmailSettings> emailSettings,
        IOptions<AppSettings> appSettings)
    {
        _logger = logger;
        _emailSettings = emailSettings.Value;
        _appSettings = appSettings.Value;
    }

    public async Task SendSignUpAsync(SignUpEmailModel model)
    {
        await SendEmailAsync(new EmailModel
        {
            ToEmail = model.Email,
            ToName = model.FirstName,
            Subject = "Sign Up",
            Body = $"<a href={_appSettings.ApiUrl}/account/verify-email?token={model.SignUpToken}>Link</a> to verify email."
        });
    }

    public async Task SendForgotPasswordAsync(ForgotPasswordEmailModel model)
    {
        await SendEmailAsync(new EmailModel
        {
            ToEmail = model.Email,
            ToName = model.FirstName,
            Subject = "Forgot Password",
            Body = $"<a href={_appSettings.WebUrl}/reset-password?token={model.ResetPasswordToken}>Link</a> to reset password."
        });
    }

    private async Task SendEmailAsync(EmailModel model)
    {
        if (_emailSettings.UseMock)
        {
            _logger.LogInformation("Email sending omitted. {@Data}", model);
            return;
        }

        var message = new MimeMessage
        {
            Subject = model.Subject,
            Body = new TextPart("html")
            {
                Text = model.Body
            }
        };

        message.From.Add(new MailboxAddress("Paralect", "ship@paralect.com"));

        var toEmail = _emailSettings.RedirectToEmail.HasValue() ? _emailSettings.RedirectToEmail : model.ToEmail;
        message.To.Add(new MailboxAddress(model.ToName, toEmail));

        using (var client = new SmtpClient())
        {
            try
            {
                await client.ConnectAsync(_emailSettings.Host, _emailSettings.Port, false);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogDebug("Email is sent. {@Data}", model);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Email failed to send. {@Data}", model);
            }
        }
    }

    public class EmailModel
    {
        public string ToEmail { get; set; }
        public string ToName { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
