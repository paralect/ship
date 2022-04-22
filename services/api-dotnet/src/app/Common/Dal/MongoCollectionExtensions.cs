using MongoDB.Driver;

namespace Common.Dal;

internal static class MongoCollectionExtensions
{
    public static async Task<Page<TDocument>> AggregateByPage<TDocument>(
        this IMongoCollection<TDocument> collection,
        FilterDefinition<TDocument> filterQuery,
        SortDefinition<TDocument> sortQuery,
        int pageIndex,
        int pageSize)
    {
        var count = await collection.CountDocumentsAsync(filterQuery);

        var pipelineDefinitions = GetPipelineDefinitions(
            filterQuery,
            sortQuery,
            pageIndex,
            pageSize);

        var data = await collection.Aggregate(
            PipelineDefinition<TDocument, TDocument>.Create(pipelineDefinitions),
            new AggregateOptions
            {
                Collation = Constants.DefaultCollation
            }).ToListAsync();

        var totalPages = (int)Math.Ceiling((decimal)count / pageSize);

        var page = new Page<TDocument>
        {
            TotalPages = totalPages,
            Count = count,
            Items = data
        };

        return page;
    }

    private static IEnumerable<PipelineStageDefinition<TDocument, TDocument>> GetPipelineDefinitions<TDocument>(
        FilterDefinition<TDocument> filterQuery,
        SortDefinition<TDocument> sortQuery,
        int pageIndex,
        int pageSize)
    {
        yield return PipelineStageDefinitionBuilder.Match(filterQuery);

        if (sortQuery != null)
        {
            yield return PipelineStageDefinitionBuilder.Sort(sortQuery);
        }

        yield return PipelineStageDefinitionBuilder.Skip<TDocument>((pageIndex - 1) * pageSize);

        yield return PipelineStageDefinitionBuilder.Limit<TDocument>(pageSize);
    }
}
