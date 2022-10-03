using System.Linq.Expressions;
using Common.Dal.Documents;
using MongoDB.Driver;

namespace Common.Dal.UpdateDocumentOperators;

public class PushOperator<TDocument, TItem> : IUpdateOperator<TDocument> where TDocument : BaseDocument
{
    private readonly Expression<Func<TDocument, IEnumerable<TItem>>> _field;
    private readonly TItem _newItem;

    public PushOperator(Expression<Func<TDocument, IEnumerable<TItem>>> field, TItem newItem)
    {
        _field = field;
        _newItem = newItem;
    }

    public UpdateDefinition<TDocument> ToUpdateDefinition()
    {
        return Builders<TDocument>.Update.Push(_field, _newItem);
    }
}
