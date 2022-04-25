using System.ComponentModel.DataAnnotations;
using Common.Enums;
using Common.Utils;

namespace Common.DalSql.Entities;

public class Token : BaseEntity, IExpirable
{
    public TokenType Type { get; set; }
    [Required]
    public string Value { get; set; }
    public DateTime ExpireAt { get; set; }
    public long UserId { get; set; }

    public User User { get; set; }
}
