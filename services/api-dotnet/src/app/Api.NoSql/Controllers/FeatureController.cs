using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement;

namespace Api.NoSql.Controllers;

/// <summary>
/// Demonstrates usage of feature flags with Microsoft.FeatureManagement.AspNetCore package
/// </summary>
public class FeatureController : BaseController
{
    private readonly IFeatureManager _featureManager;

    public FeatureController(IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }

    [HttpGet("get-test-feature")]
    public async Task<IActionResult> Index()
    {
        return Ok(new
        {
            IsTestFeatureEnabled = await _featureManager.IsEnabledAsync("TestFeatureEnabled")
        });
    }
}