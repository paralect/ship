using Api.Views.Models.View.Account;
using Api.Views.Utils;
using FluentValidation;

namespace Api.Views.Validators.Account;

public class ForgotPasswordModelValidator : AbstractValidator<ForgotPasswordModel>
{
    public ForgotPasswordModelValidator()
    {
        RuleFor(x => x.Email).Email();
    }
}
