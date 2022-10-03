using System.Security.Cryptography;

namespace Common.Utils;

public static class SecurityUtils
{
    public static string GenerateSecureToken(int tokenLength = 48)
    {
        var buf = RandomNumberGenerator.GetBytes(tokenLength);

        return BytesToString(buf);
    }

    public static string GetHash(this string str)
    {
        return BCrypt.Net.BCrypt.HashPassword(str, 10);
    }

    public static bool IsHashEqual(this string str, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(str, hash);
    }

    public static string BytesToString(byte[] data)
    {
        return BitConverter.ToString(data).Replace("-", string.Empty);
    }
}
