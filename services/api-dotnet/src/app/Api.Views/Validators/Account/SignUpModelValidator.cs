using Api.Views.Models.View.Account;
using Api.Views.Utils;
using FluentValidation;

namespace Api.Views.Validators.Account;

public class SignUpModelValidator : AbstractValidator<SignUpModel>
{
    public SignUpModelValidator()
    {
        RuleFor(x => x.Email).Email();

        RuleFor(x => x.Password).Password();

        RuleFor(x => x.FirstName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("First name is required.")
            .MinimumLength(2).WithMessage("Your first name must be longer than 1 letter.");

        RuleFor(x => x.LastName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Last name is required.")
            .MinimumLength(2).WithMessage("Your last name must be longer than 1 letter.");
    }
}