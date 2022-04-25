using Api.Views.Models.View.Account;
using Api.Views.Utils;
using FluentValidation;

namespace Api.Views.Validators.Account;

public class SignInModelValidator : AbstractValidator<SignInModel>
{
    public SignInModelValidator()
    {
        RuleFor(x => x.Email).Email();
        RuleFor(x => x.Password).Password();
    }
}
