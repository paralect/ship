using System.Linq.Expressions;
using Common.Dal.Documents;
using MongoDB.Driver;

namespace Common.Dal.UpdateDocumentOperators;

public class PullOperator<TDocument, TItem> : IUpdateOperator<TDocument> where TDocument : BaseDocument
{
    private readonly Expression<Func<TDocument, IEnumerable<TItem>>> _field;
    private readonly TItem _value;

    public PullOperator(Expression<Func<TDocument, IEnumerable<TItem>>> field, TItem value)
    {
        _field = field;
        _value = value;
    }

    public UpdateDefinition<TDocument> ToUpdateDefinition()
    {
        return Builders<TDocument>.Update.Pull(_field, _value);
    }
}
