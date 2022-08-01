using Microsoft.AspNetCore.Http;

namespace Common.Models.View.User;

public class UploadAvatarModel
{
    public IFormFile File { get; set; }
}