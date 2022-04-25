using System.Linq.Expressions;
using Common.Dal.Documents;
using Common.Dal.Interfaces;
using Common.Dal.UpdateDocumentOperators;
using Common.Utils;
using MongoDB.Driver;

namespace Common.Dal;

public abstract class BaseRepository<TDocument, TFilter> : IRepository<TDocument, TFilter>
    where TDocument : BaseDocument
    where TFilter : BaseFilter, new()
{
    protected readonly IDbContext dbContext;
    protected readonly IIdGenerator idGenerator;
    protected readonly IMongoCollection<TDocument> collection;

    protected BaseRepository(
        IDbContext dbContext,
        IIdGenerator idGenerator,
        Func<IDbContext, IMongoCollection<TDocument>> collectionProvider
    )
    {
        this.dbContext = dbContext;
        this.idGenerator = idGenerator;
        collection = collectionProvider(this.dbContext);
    }

    public async Task<TDocument> FindOneAsync(TFilter filter)
    {
        var result = await collection.FindAsync(BuildFilterQuery(filter, false));
        return result.SingleOrDefault();
    }

    public async Task<Page<TDocument>> FindPageAsync(
        TFilter filter,
        IList<(string, SortDirection)> sortFields,
        int page,
        int pageSize)
    {
        var filterQuery = BuildFilterQuery(filter, false);
        var sortQuery = BuildSortQuery(sortFields);

        return await collection.AggregateByPage(filterQuery, sortQuery, page, pageSize);
    }

    public async Task InsertAsync(TDocument document)
    {
        AddId(document);
        AddCreatedOn(document);

        await collection.InsertOneAsync(document);
    }

    public async Task InsertManyAsync(IEnumerable<TDocument> documents)
    {
        foreach (var document in documents)
        {
            AddId(document);
            AddCreatedOn(document);
        }

        await collection.InsertManyAsync(documents);
    }

    public async Task UpdateOneAsync<TField>(string id, Expression<Func<TDocument, TField>> fieldSelector, TField value)
    {
        await UpdateOneAsync(id, new SetOperator<TDocument, TField>(fieldSelector, value));
    }

    public async Task UpdateOneAsync(string id, IUpdateOperator<TDocument> update)
    {
        await UpdateOneAsync(id, new[] { update });
    }

    public async Task UpdateOneAsync(string id, IEnumerable<IUpdateOperator<TDocument>> updates)
    {
        var filterDefinition = GetFilterById(id);
        var updateDefinition = Builders<TDocument>.Update.Combine(updates.Select(update => update.ToUpdateDefinition()));

        await collection.UpdateOneAsync(filterDefinition, updateDefinition);
    }

    public async Task DeleteManyAsync(TFilter filter)
    {
        await collection.DeleteManyAsync(BuildFilterQuery(filter));
    }

    protected virtual IEnumerable<FilterDefinition<TDocument>> GetFilterQueries(TFilter filter)
    {
        return new List<FilterDefinition<TDocument>>();
    }

    private FilterDefinition<TDocument> BuildFilterQuery(TFilter filter, bool isEmptyFilterCheckEnabled = true)
    {
        var filterQueries = GetFilterQueries(filter).ToList();
        if (filter.Id.HasValue())
        {
            filterQueries.Add(GetFilterById(filter.Id));
        }

        if (isEmptyFilterCheckEnabled && !filterQueries.Any() && !filter.IsEmptyFilterAllowed)
        {
            throw new ApplicationException("Empty filter is not allowed");
        }

        return filterQueries.Any()
            ? Builders<TDocument>.Filter.And(filterQueries)
            : FilterDefinition<TDocument>.Empty;
    }

    private SortDefinition<TDocument> BuildSortQuery(IList<(string Key, SortDirection Value)> sortFields)
    {
        if (sortFields == null || !sortFields.Any())
        {
            return null;
        }

        var builder = Builders<TDocument>.Sort;

        var sortDefinitions = new List<SortDefinition<TDocument>>();
        foreach (var field in sortFields)
        {
            sortDefinitions.Add(field.Value == SortDirection.Ascending
                ? builder.Ascending(field.Key)
                : builder.Descending(field.Key));
        }

        return builder.Combine(sortDefinitions);
    }

    private FilterDefinition<TDocument> GetFilterById(string id)
    {
        return Builders<TDocument>.Filter.Eq(d => d.Id, id);
    }

    private void AddId(TDocument document)
    {
        if (document.Id.HasNoValue())
        {
            document.Id = idGenerator.Generate();
        }
    }

    private void AddCreatedOn(TDocument document)
    {
        document.CreatedOn = DateTime.UtcNow;
    }
}
