using Common.Models.View.Account;
using Common.Utils;
using FluentValidation;

namespace Common.Validators.Account;

public class ResendVerificationModelValidator : AbstractValidator<ResendVerificationModel>
{
    public ResendVerificationModelValidator()
    {
        RuleFor(x => x.Email).Email();
    }
}
