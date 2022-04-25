using System.ComponentModel.DataAnnotations;
using Common.Enums;

namespace Common.DalSql.Entities;

public class User : BaseEntity
{
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public string PasswordHash { get; set; }
    [Required]
    public string Email { get; set; }
    public UserRole Role { get; set; }
    public string PhoneNumber { get; set; }
    public bool IsEmailVerified { get; set; }
    [Required]
    public string SignupToken { get; set; }
    public DateTime LastRequest { get; set; }
    public string ResetPasswordToken { get; set; }

    public ICollection<Token> Tokens { get; set; }
}
