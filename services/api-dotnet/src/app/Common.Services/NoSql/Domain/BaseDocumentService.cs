using Common.Dal;
using Common.Dal.Documents;
using Common.Dal.Interfaces;
using Common.Services.NoSql.Domain.Interfaces;

namespace Common.Services.NoSql.Domain;

public class BaseDocumentService<TDocument, TFilter> : IDocumentService<TDocument, TFilter>
    where TDocument : BaseDocument
    where TFilter : BaseFilter, new()
{
    private readonly IRepository<TDocument, TFilter> _repository;

    public BaseDocumentService(IRepository<TDocument, TFilter> repository)
    {
        _repository = repository;
    }

    public async Task<TDocument> FindByIdAsync(string id)
    {
        return await FindOneAsync(new TFilter { Id = id });
    }

    public async Task<TDocument> FindOneAsync(TFilter filter)
    {
        return await _repository.FindOneAsync(filter);
    }

    public async Task<Page<TDocument>> FindPageAsync(
        TFilter filter,
        IList<(string, SortDirection)> sortFields,
        int page,
        int pageSize
    )
    {
        return await _repository.FindPageAsync(filter, sortFields, page, pageSize);
    }
}
