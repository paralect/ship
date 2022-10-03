using FluentValidation;

namespace Common.Utils;

public static class ValidatorExtensions
{
    public static IRuleBuilderOptions<T, string> Email<T>(this IRuleBuilderInitial<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Please enter a valid email address.");
    }

    public static IRuleBuilderOptions<T, string> Password<T>(this IRuleBuilderInitial<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Password is required.")
            .Length(6, 20).WithMessage("Incorrect email or password.");
    }
}
