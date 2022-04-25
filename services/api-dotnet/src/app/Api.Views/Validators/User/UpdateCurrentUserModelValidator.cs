using Api.Views.Models.View.User;
using Api.Views.Utils;
using FluentValidation;

namespace Api.Views.Validators.User;

public class UpdateCurrentUserModelValidator : AbstractValidator<UpdateCurrentUserModel>
{
    public UpdateCurrentUserModelValidator()
    {
        RuleFor(x => x.Password).Password();
    }
}
