using Common.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Api.NoSql.Security;

public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly string[] _roles;

    public AuthorizeAttribute(params UserRole[] allowedRoles)
    {
        _roles = allowedRoles.Select(x => Enum.GetName(typeof(UserRole), x)).ToArray();
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!(context.HttpContext.User.Identity?.IsAuthenticated ?? false))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var user = context.HttpContext.User;
        if (_roles.Length > 0 && !_roles.Any(x => user.IsInRole(x)))
        {
            context.Result = new StatusCodeResult(StatusCodes.Status403Forbidden);
            return;
        }
    }
}
