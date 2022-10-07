namespace Common.Services.Infrastructure.Interfaces;

public interface ICloudStorageService
{
    Task<string> UploadPublicAsync(string key, Stream fileStream);
}