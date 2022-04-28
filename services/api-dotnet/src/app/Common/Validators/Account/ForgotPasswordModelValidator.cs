using Common.Models.View.Account;
using Common.Utils;
using FluentValidation;

namespace Common.Validators.Account;

public class ForgotPasswordModelValidator : AbstractValidator<ForgotPasswordModel>
{
    public ForgotPasswordModelValidator()
    {
        RuleFor(x => x.Email).Email();
    }
}
