using Common.Dal.Documents;
using MongoDB.Driver;

namespace Common.Dal.UpdateDocumentOperators;

public interface IUpdateOperator<TDocument> where TDocument : BaseDocument
{
    UpdateDefinition<TDocument> ToUpdateDefinition();
}
