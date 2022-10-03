namespace Common.Caching.Interfaces;

public interface ICache
{
    Task<T> GetAsync<T>(string key, CancellationToken cancellationToken = default);
    Task SetAsync<T>(string key, T value, CancellationToken cancellationToken = default);
    Task SetAsync<T>(string key,
        T value,
        TimeSpan? absoluteExpiration,
        TimeSpan? slidingExpiration,
        CancellationToken cancellationToken = default);
}
