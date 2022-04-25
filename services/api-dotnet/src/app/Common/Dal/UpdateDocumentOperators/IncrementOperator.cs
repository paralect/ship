using System.Linq.Expressions;
using Common.Dal.Documents;
using MongoDB.Driver;

namespace Common.Dal.UpdateDocumentOperators;

public class IncrementOperator<TDocument, TItem> : IUpdateOperator<TDocument> where TDocument : BaseDocument
{
    private readonly Expression<Func<TDocument, TItem>> _field;
    private readonly TItem _incrementByValue;

    public IncrementOperator(Expression<Func<TDocument, TItem>> field, TItem incrementByValue)
    {
        _field = field;
        _incrementByValue = incrementByValue;
    }
    public UpdateDefinition<TDocument> ToUpdateDefinition()
    {
        return Builders<TDocument>.Update.Inc(_field, _incrementByValue);
    }
}
