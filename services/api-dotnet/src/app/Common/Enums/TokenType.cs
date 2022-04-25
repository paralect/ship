using System.ComponentModel;

namespace Common.Enums;

public enum TokenType
{
    [Description("refresh")]
    Refresh,
    [Description("access")]
    Access
}
