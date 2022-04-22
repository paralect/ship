using System.Security.Principal;

namespace Common.Middleware;

public class Principal : GenericPrincipal
{
    public Principal(IIdentity identity, string[] roles) : base(identity, roles)
    { }
}
