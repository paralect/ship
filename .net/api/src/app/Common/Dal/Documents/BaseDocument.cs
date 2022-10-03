using MongoDB.Bson.Serialization.Attributes;

namespace Common.Dal.Documents;

public class BaseDocument
{
    [BsonId]
    public string Id { get; set; }
    public DateTime CreatedOn { get; set; }
}
