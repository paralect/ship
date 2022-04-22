using Common.Dal.Documents.Token;
using Common.Dal.Documents.User;
using Common.Dal.Interfaces;
using MongoDB.Driver;

namespace Common.Dal;

public class DbContext : IDbContext
{
    public DbContext(
        IMongoClient client,
        IMongoCollection<User> users,
        IMongoCollection<Token> tokens
    )
    {
        Client = client;

        Users = users;
        Tokens = tokens;
    }

    public IMongoClient Client { get; }

    public IMongoCollection<User> Users { get; }
    public IMongoCollection<Token> Tokens { get; }
}
