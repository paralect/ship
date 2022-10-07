using Common.Models.View.User;
using Common.Utils;
using FluentValidation;

namespace Common.Validators.User;

public class UpdateCurrentUserModelValidator : AbstractValidator<UpdateCurrentUserModel>
{
    public UpdateCurrentUserModelValidator()
    {
        RuleFor(x => x.Password).Password();
    }
}
