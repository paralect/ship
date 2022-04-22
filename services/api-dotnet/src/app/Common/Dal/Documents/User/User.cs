using Common.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Dal.Documents.User;

public class User : BaseDocument
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    [BsonIgnoreIfNull]
    public string PasswordHash { get; set; }
    public string Email { get; set; }
    public UserRole Role { get; set; }
    public bool IsEmailVerified { get; set; }
    [BsonIgnoreIfNull]
    public string SignupToken { get; set; }
    [BsonIgnoreIfNull]
    public string ResetPasswordToken { get; set; }
    public DateTime LastRequest { get; set; }
}
