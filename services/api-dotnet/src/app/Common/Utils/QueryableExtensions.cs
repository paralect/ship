using System.Linq.Expressions;
using System.Reflection;
using Common.DalSql;

namespace Common.Utils;

public static class QueryableExtensions
{
    public static IQueryable<TEntity> Order<TEntity>(this IQueryable<TEntity> query, IEnumerable<SortField> sortFields)
    {
        var sortList = sortFields == null ? new List<SortField>() : sortFields.ToList();

        foreach (var sort in sortList)
        {
            var expression = GenerateOrderByExpression(sort, query);
            query = query.Provider.CreateQuery<TEntity>(expression);
        }

        return query;
    }

    // Link to source code https://stackoverflow.com/questions/7265186/how-do-i-specify-the-linq-orderby-argument-dynamically/7265354#7265354
    private static MethodCallExpression GenerateOrderByExpression<TEntity>(SortField sort, IQueryable<TEntity> query)
    {
        if (query == null)
        {
            throw new ArgumentNullException(nameof(query));
        }

        var type = typeof(TEntity);
        var property = type.GetProperty(
            sort.FieldName,
            BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase
        );

        if (property is null)
        {
            throw new ArgumentException("Invalid field name", nameof(sort.FieldName));
        }

        var isOrdered = query.Expression.Type == typeof(IOrderedQueryable<TEntity>);
        var sortBy = isOrdered ? "Then" : "Order";
        var sortDirection = sort.Direction == SortDirection.Ascending ? "By" : "ByDescending";
        var command = $"{sortBy}{sortDirection}";

        var parameter = Expression.Parameter(type);
        var propertyAccess = Expression.MakeMemberAccess(parameter, property);
        var orderByExpression = Expression.Lambda(propertyAccess, parameter);
        var resultExpression = Expression.Call(
            typeof(Queryable),
            command,
            new[] { type, property.PropertyType },
            query.Expression,
            Expression.Quote(orderByExpression)
        );

        return resultExpression;
    }
}
