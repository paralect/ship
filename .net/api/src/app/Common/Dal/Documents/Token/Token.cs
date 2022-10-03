using Common.Enums;
using Common.Utils;

namespace Common.Dal.Documents.Token;

public class Token : BaseDocument, IExpirable
{
    public TokenType Type { get; set; }
    public string Value { get; set; }
    public DateTime ExpireAt { get; set; }
    public string UserId { get; set; }
    public UserRole UserRole { get; set; }
}
