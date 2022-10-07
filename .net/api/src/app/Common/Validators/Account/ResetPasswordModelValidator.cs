using Common.Models.View.Account;
using Common.Utils;
using FluentValidation;

namespace Common.Validators.Account;

public class ResetPasswordModelValidator : AbstractValidator<ResetPasswordModel>
{
    public ResetPasswordModelValidator()
    {
        RuleFor(x => x.Password).Password();
        RuleFor(x => x.Token).NotEmpty();
    }
}
