using System.Linq.Expressions;
using Common.DalSql;
using Common.DalSql.Entities;
using Common.DalSql.Filters;

namespace Common.Services.Sql.Domain.Interfaces;

public interface IEntityService<TEntity, in TFilter>
    where TEntity : BaseEntity
    where TFilter : BaseFilter<TEntity>
{
    Task<TEntity> FindByIdAsync(long id);
    Task<TEntity> FindOneAsync(TFilter filter);
    Task<TResultModel> FindOneAsync<TResultModel>(TFilter filter, Expression<Func<TEntity, TResultModel>> map);
    Task<Page<TResultModel>> FindPageAsync<TResultModel>(
        TFilter filter,
        ICollection<SortField> sortFields,
        int page,
        int pageSize,
        Expression<Func<TEntity, TResultModel>> map
    );
    Task<bool> AnyAsync(TFilter filter);
}
