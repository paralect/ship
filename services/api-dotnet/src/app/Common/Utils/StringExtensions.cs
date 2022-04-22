using System.Text.RegularExpressions;
using Common.Dal;
using MongoDB.Bson;

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

    public static BsonRegularExpression ToRegex(this string value, StringComparisonMode comparisonMode)
    {
        switch (comparisonMode)
        {
            case StringComparisonMode.StrictEqual:
                return value.ToRegexMatchEquals();
            case StringComparisonMode.Contains:
                return value.ToRegexMatchContains();
            case StringComparisonMode.EndsWith:
                return value.ToRegexMatchEndsWith();
            default:
                throw new NotSupportedException(nameof(StringComparisonMode));
        }
    }

    private static BsonRegularExpression ToRegexMatchContains(this string value)
    {
        var regexFilter = $"/{Regex.Escape(value)}/i";

        return new BsonRegularExpression(regexFilter);
    }

    private static BsonRegularExpression ToRegexMatchEquals(this string value)
    {
        var regexFilter = $"/^{Regex.Escape(value)}$/i";

        return new BsonRegularExpression(regexFilter);
    }

    private static BsonRegularExpression ToRegexMatchEndsWith(this string value)
    {
        var regexFilter = $"/{Regex.Escape(value)}$/i";

        return new BsonRegularExpression(regexFilter);
    }
}
