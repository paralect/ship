using Common.Models.View.Account;
using Common.Utils;
using FluentValidation;

namespace Common.Validators.Account;

public class SignInModelValidator : AbstractValidator<SignInModel>
{
    public SignInModelValidator()
    {
        RuleFor(x => x.Email).Email();
        RuleFor(x => x.Password).Password();
    }
}
