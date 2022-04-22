using System.Linq.Expressions;
using Common.DalSql.Entities;

namespace Common.DalSql.Filters;

public abstract class BaseFilter<TEntity> where TEntity : BaseEntity
{
    protected BaseFilter()
    {
        IncludeProperties = new List<Expression<Func<TEntity, object>>>();
    }

    public long? Id { get; set; }
    public List<Expression<Func<TEntity, object>>> IncludeProperties { get; set; }
    public bool AsNoTracking { get; set; }
    // should be set to true, if we intentionally want to query all data in the collection
    public bool IsEmptyFilterAllowed { get; set; }

    public abstract IEnumerable<Expression<Func<TEntity, bool>>> GetPredicates();
}
