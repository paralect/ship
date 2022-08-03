using Amazon.S3;
using Amazon.S3.Transfer;
using Common.Services.Infrastructure.Interfaces;
using Common.Settings;
using Microsoft.Extensions.Options;

namespace Common.Services.Infrastructure.CloudStorage;

public class CloudStorageService : ICloudStorageService
{
    private readonly CloudStorageSettings _cloudStorageSettings;
    private readonly AmazonS3Config _amazonS3Config;

    public CloudStorageService(IOptions<CloudStorageSettings> cloudStorageSettings)
    {
        _cloudStorageSettings = cloudStorageSettings.Value;
        _amazonS3Config = new AmazonS3Config { ServiceURL = $"https://{_cloudStorageSettings.Endpoint}" };
    }

    public async Task<string> UploadPublicAsync(string key, Stream fileStream)
    {
        using var client = InitializeClient();
        using var transferUtility = new TransferUtility(client);

        var request = new TransferUtilityUploadRequest
        {
            BucketName = _cloudStorageSettings.BucketName,
            Key = $"{_cloudStorageSettings.FolderName}/{key}",
            InputStream = fileStream,
            CannedACL = S3CannedACL.PublicRead,
        };

        await transferUtility.UploadAsync(request);

        return $"https://{request.BucketName}.{_cloudStorageSettings.Endpoint}/{request.Key}";
    }

    private AmazonS3Client InitializeClient() =>
        new(_cloudStorageSettings.AccessKey, _cloudStorageSettings.Secret, _amazonS3Config);
}