using Common.Dal.Documents.Token;
using Common.Dal.Documents.User;
using MongoDB.Driver;

namespace Common.Dal.Interfaces;

public interface IDbContext
{
    IMongoClient Client { get; }

    IMongoCollection<User> Users { get; }
    IMongoCollection<Token> Tokens { get; }
}
