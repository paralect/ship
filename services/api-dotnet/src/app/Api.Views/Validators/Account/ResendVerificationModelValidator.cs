using Api.Views.Models.View.Account;
using Api.Views.Utils;
using FluentValidation;

namespace Api.Views.Validators.Account;

public class ResendVerificationModelValidator : AbstractValidator<ResendVerificationModel>
{
    public ResendVerificationModelValidator()
    {
        RuleFor(x => x.Email).Email();
    }
}
