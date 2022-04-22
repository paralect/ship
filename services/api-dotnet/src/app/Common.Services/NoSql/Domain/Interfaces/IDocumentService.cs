using Common.Dal;
using Common.Dal.Documents;

namespace Common.Services.NoSql.Domain.Interfaces;

public interface IDocumentService<TDocument, in TFilter>
    where TDocument : BaseDocument
    where TFilter : BaseFilter
{
    Task<TDocument> FindByIdAsync(string id);
    Task<TDocument> FindOneAsync(TFilter filter);
    Task<Page<TDocument>> FindPageAsync(
        TFilter filter,
        IList<(string, SortDirection)> sortFields,
        int page,
        int pageSize
    );
}
