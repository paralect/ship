using System.Linq.Expressions;
using Common.Dal.Documents;
using MongoDB.Driver;

namespace Common.Dal.UpdateDocumentOperators;

public class PullManyOperator<TDocument, TItem> : IUpdateOperator<TDocument> where TDocument : BaseDocument
{
    private readonly Expression<Func<TDocument, IEnumerable<TItem>>> _field;
    private readonly IEnumerable<TItem> _value;

    public PullManyOperator(Expression<Func<TDocument, IEnumerable<TItem>>> field, IEnumerable<TItem> value)
    {
        _field = field;
        _value = value;
    }

    public UpdateDefinition<TDocument> ToUpdateDefinition()
    {
        return Builders<TDocument>.Update.PullAll(_field, _value);
    }
}
