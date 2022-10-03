using Common.Dal.Interfaces;
using MongoDB.Bson;

namespace Common.Dal;

public class IdGenerator : IIdGenerator
{
    public string Generate()
    {
        return ObjectId.GenerateNewId().ToString();
    }
}
