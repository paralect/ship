using MongoDB.Driver;
using MongoDBMigrations;
using MongoDB.Bson;
using Version = MongoDBMigrations.Version;

namespace Migrator.NoSql.Migrations;

public class M_001_DemoInsertTestDocument : IMigration
{
    public Version Version => new Version(1, 0, 0);
    public string Name => "Insert test document to demonstrate migration in action";
    
    public void Up(IMongoDatabase database)
    {
        var filterBuilder = Builders<BsonDocument>.Filter;
        var updateBuilder = Builders<BsonDocument>.Update;
        
        var collection = database.GetCollection<BsonDocument>("test");

        collection.InsertOne(new BsonDocument { { "testValue", 123 } });
    }

    public void Down(IMongoDatabase database)
    {
    }
}