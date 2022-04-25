using Common.Caching.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Sql.Controllers;

public class CacheController : BaseController
{
    private readonly ICache _cache;

    public CacheController(ICache cache)
    {
        _cache = cache;
    }

    [HttpGet("get")]
    public async Task<IActionResult> GetFromCacheAsync(string key)
    {
        var value = await _cache.GetAsync<string>(key);

        return Ok(value);
    }

    [HttpPost("set")]
    public async Task<IActionResult> SetToCacheAsync(string key, string value)
    {
        await _cache.SetAsync(key, value);

        return Ok();
    }
}
