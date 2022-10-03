using System.Linq.Expressions;
using Common.DalSql.Entities;
using Common.DalSql.Filters;

namespace Common.DalSql.Interfaces;

public interface IRepository<TEntity, in TFilter>
    where TEntity : BaseEntity
    where TFilter : BaseFilter<TEntity>
{
    Task<TEntity> FindById(long id);
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

    Task InsertAsync(TEntity entity);
    Task InsertManyAsync(IEnumerable<TEntity> entities);

    Task UpdateOneAsync(long id, Action<TEntity> updater);

    Task DeleteManyAsync(TFilter filter);
}
