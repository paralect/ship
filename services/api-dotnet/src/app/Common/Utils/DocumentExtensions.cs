namespace Common.Utils;

public static class DocumentExtensions
{
    public static bool IsExpired(this IExpirable token)
    {
        return token.ExpireAt <= DateTime.UtcNow;
    }
}

public interface IExpirable
{
    public DateTime ExpireAt { get; set; }
}
