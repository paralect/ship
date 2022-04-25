using System.Text.Json;
using Common.Caching.Interfaces;
using Common.Settings;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Common.Caching;

public class Cache : ICache
{
    private readonly IDistributedCache _distributedCache;
    private readonly ILogger<Cache> _logger;
    private readonly CacheSettings _cacheSettings;

    public Cache(
        IDistributedCache distributedCache,
        ILogger<Cache> logger,
        IOptions<CacheSettings> cacheSettings)
    {
        _distributedCache = distributedCache;
        _logger = logger;
        _cacheSettings = cacheSettings.Value;
    }

    public async Task<T> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        if (!_cacheSettings.IsEnabled) return default;

        try
        {
            var json = await _distributedCache.GetAsync(key, cancellationToken);

            return json != null
                ? JsonSerializer.Deserialize<T>(json)
                : default;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cache read error. Key: {@Key}", key);

            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, CancellationToken cancellationToken = default) =>
        await SetAsync(key, value, null, null, cancellationToken);

    public async Task SetAsync<T>(string key,
        T value,
        TimeSpan? absoluteExpiration,
        TimeSpan? slidingExpiration,
        CancellationToken cancellationToken = default)
    {
        if (!_cacheSettings.IsEnabled) return;

        try
        {
            var json = JsonSerializer.Serialize(value);

            await _distributedCache.SetStringAsync(key,
                json,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow =
                        absoluteExpiration ?? TimeSpan.FromSeconds(_cacheSettings.AbsoluteExpirationInSeconds),
                    SlidingExpiration =
                        slidingExpiration ?? TimeSpan.FromSeconds(_cacheSettings.SlidingExpirationInSeconds)
                },
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex,
                "Cache write error. Key: {@Key}. ValueType: {@ValueType}",
                key,
                value.GetType());
        }
    }
}