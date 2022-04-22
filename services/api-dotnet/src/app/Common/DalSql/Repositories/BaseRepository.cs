using System.Linq.Expressions;
using Common.DalSql.Entities;
using Common.DalSql.Filters;
using Common.DalSql.Interfaces;
using Common.Utils;
using Microsoft.EntityFrameworkCore;

namespace Common.DalSql.Repositories;

public abstract class BaseRepository<TEntity, TFilter> : IRepository<TEntity, TFilter>
    where TEntity : BaseEntity
    where TFilter : BaseFilter<TEntity>, new()
{
    protected readonly ShipDbContext dbContext;
    protected readonly DbSet<TEntity> table;

    protected BaseRepository(
        ShipDbContext dbContext,
        Func<ShipDbContext, DbSet<TEntity>> tableProvider
    )
    {
        this.dbContext = dbContext;
        table = tableProvider(this.dbContext);
    }

    public async Task<TEntity> FindById(long id)
    {
        return await FindOneAsync(new TFilter
        {
            Id = id
        });
    }

    public async Task<TEntity> FindOneAsync(TFilter filter)
    {
        return await BuildFilterQuery(filter, false).FirstOrDefaultAsync();
    }

    public async Task<TResultModel> FindOneAsync<TResultModel>(TFilter filter, Expression<Func<TEntity, TResultModel>> map)
    {
        return await BuildFilterQuery(filter, false).Select(map).FirstOrDefaultAsync();
    }

    public async Task<Page<TResultModel>> FindPageAsync<TResultModel>(
        TFilter filter,
        ICollection<SortField> sort,
        int pageNumber,
        int pageSize,
        Expression<Func<TEntity, TResultModel>> map)
    {
        var query = BuildFilterQuery(filter, false);
        var count = await query.CountAsync();

        IEnumerable<TResultModel> items;

        var skip = (pageNumber - 1) * pageSize;
        if (skip >= count)
        {
            items = Enumerable.Empty<TResultModel>();
        }
        else
        {
            items = await query
                .Order(sort)
                .Skip(skip)
                .Take(pageSize)
                .Select(map)
                .ToListAsync();
        }

        return new Page<TResultModel>
        {
            TotalPages = (int)Math.Ceiling((float)count / pageSize),
            Count = count,
            Items = items
        };
    }

    public async Task<bool> AnyAsync(TFilter filter)
    {
        return await BuildFilterQuery(filter, false).AnyAsync();
    }

    public async Task InsertAsync(TEntity entity)
    {
        AddCreatedOn(entity);

        table.Add(entity);
        await dbContext.SaveChangesAsync();
    }

    public async Task InsertManyAsync(IEnumerable<TEntity> entities)
    {
        foreach (var entity in entities)
        {
            AddCreatedOn(entity);
        }

        table.AddRange(entities);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateOneAsync(long id, Action<TEntity> updater)
    {
        var entity = await FindById(id);

        updater(entity);

        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteManyAsync(TFilter filter)
    {
        var query = BuildFilterQuery(filter);
        table.RemoveRange(query);
        await dbContext.SaveChangesAsync();
    }

    private IQueryable<TEntity> BuildFilterQuery(BaseFilter<TEntity> filter, bool isEmptyFilterCheckEnabled = true)
    {
        var query = table.AsQueryable();
        if (filter.AsNoTracking)
        {
            query = query.AsNoTracking();
        }

        var predicates = filter.GetPredicates().ToList();
        if (filter.Id.HasValue)
        {
            predicates.Add(entity => entity.Id == filter.Id);
        }

        if (isEmptyFilterCheckEnabled && !predicates.Any() && !filter.IsEmptyFilterAllowed)
        {
            throw new ApplicationException("Empty filter is not allowed");
        }

        if (predicates.Any())
        {
            predicates.ForEach(predicate => query = query.Where(predicate));
        }

        if (filter.IncludeProperties.Any())
        {
            foreach (var includeProperty in filter.IncludeProperties)
            {
                query = query.Include(includeProperty);
            }
        }

        return query;
    }

    private void AddCreatedOn(TEntity entity)
    {
        entity.CreatedOn = DateTime.UtcNow;
    }
}
