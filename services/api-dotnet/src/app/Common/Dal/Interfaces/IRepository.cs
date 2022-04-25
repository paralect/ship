using System.Linq.Expressions;
using Common.Dal.Documents;
using Common.Dal.UpdateDocumentOperators;

namespace Common.Dal.Interfaces;

public interface IRepository<TDocument, in TFilter>
    where TDocument : BaseDocument
    where TFilter : BaseFilter
{
    Task<TDocument> FindOneAsync(TFilter filter);
    Task<Page<TDocument>> FindPageAsync(
        TFilter filter,
        IList<(string, SortDirection)> sortFields,
        int page,
        int pageSize
    );

    Task InsertAsync(TDocument document);
    Task InsertManyAsync(IEnumerable<TDocument> documents);

    Task UpdateOneAsync<TField>(string id, Expression<Func<TDocument, TField>> fieldSelector, TField value);
    Task UpdateOneAsync(string id, IUpdateOperator<TDocument> update);
    Task UpdateOneAsync(string id, IEnumerable<IUpdateOperator<TDocument>> updates);

    Task DeleteManyAsync(TFilter filter);
}
