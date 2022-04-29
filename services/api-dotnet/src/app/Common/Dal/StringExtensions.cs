using System.Text.RegularExpressions;
using MongoDB.Bson;

namespace Common.Dal;

public static class StringExtensions
{
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