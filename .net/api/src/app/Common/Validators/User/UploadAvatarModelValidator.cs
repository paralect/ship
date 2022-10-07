using Common.Models.View.User;
using FluentValidation;

namespace Common.Validators.User;

public class UploadAvatarModelValidator : AbstractValidator<UploadAvatarModel>
{
    private const long FileSizeLimitInMb = 2;
    private const long FileSizeLimit = FileSizeLimitInMb * 1024 * 1024;

    private readonly IList<string> _allowedContentTypes =
        new List<string> { "image/png", "image/jpg", "image/jpeg" };


    public UploadAvatarModelValidator()
    {
        RuleFor(x => x.File).NotEmpty()
            .Must(x => _allowedContentTypes.Any(y => x.ContentType == y))
            .WithMessage("Sorry, you can only upload JPG, JPEG or PNG photos.")
            .Must(x => x.Length <= FileSizeLimit)
            .WithMessage($"Sorry, you cannot upload a file larger than {FileSizeLimitInMb} MB.");
    }
}