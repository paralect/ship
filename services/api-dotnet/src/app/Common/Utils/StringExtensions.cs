namespace Common.Utils;

public static class StringExtensions
{
    public static bool HasNoValue(this string value)
    {
        return string.IsNullOrEmpty(value);
    }

    public static bool HasValue(this string value)
    {
        return !value.HasNoValue();
    }

    public static string ToCamelCase(this string value)
    {
        if (value.HasValue() && value.Length > 1)
        {
            return char.ToLowerInvariant(value[0]) + value.Substring(1);
        }

        return value;
    }
}
