using Api.Views.Models.View.Account;
using Api.Views.Utils;
using FluentValidation;

namespace Api.Views.Validators.Account;

public class ResetPasswordModelValidator : AbstractValidator<ResetPasswordModel>
{
    public ResetPasswordModelValidator()
    {
        RuleFor(x => x.Password).Password();
        RuleFor(x => x.Token).NotEmpty();
    }
}
