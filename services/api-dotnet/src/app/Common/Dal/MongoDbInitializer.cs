using Common.Dal.Documents.Token;
using Common.Dal.Documents.User;
using Common.Enums;
using Common.Settings;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Common.Dal;

public static class MongoDbInitializer
{
    public static void InitializeDb(this IServiceCollection services, DbSettings dbSettings)
    {
        var conventionPack = new ConventionPack
            {
                new CamelCaseElementNameConvention(),
                new EnumRepresentationConvention(BsonType.String)
            };
        ConventionRegistry.Register("overrides", conventionPack, _ => true);

        // custom serialization/deserialization to store enum Description attributes in DB
        // TODO rewrite to apply to all enums, if possible OR rewrite Node API to store enums as numbers
        BsonSerializer.RegisterSerializer(typeof(TokenType), new EnumSerializer<TokenType>());

        InitializeCollections(services, dbSettings);
    }

    private static void InitializeCollections(IServiceCollection services, DbSettings dbSettings)
    {
        var client = new MongoClient(dbSettings.ConnectionStrings.Api);
        services.AddSingleton<IMongoClient>(client);

        var db = client.GetDatabase(dbSettings.ApiDatabase);
        var collectionDescriptions = new List<CollectionDescription>
            {
                new()
                {
                    Name = Constants.DbDocuments.Users,
                    DocumentType = typeof(User),
                    IndexDescriptions = new []
                    {
                        new IndexDescription
                        {
                            IndexKeysDefinition = Builders<User>.IndexKeys.Ascending(user => user.Email),
                            Options = new CreateIndexOptions { Unique = true }
                        }
                    }
                },
                new()
                {
                    Name = Constants.DbDocuments.Tokens,
                    DocumentType = typeof(Token)
                }
            };

        foreach (var description in collectionDescriptions)
        {
            var method = typeof(IMongoDatabase).GetMethod("GetCollection");
            var generic = method.MakeGenericMethod(description.DocumentType);
            var collection = generic.Invoke(db, new object[] { description.Name, null });
            var collectionType = typeof(IMongoCollection<>).MakeGenericType(description.DocumentType);

            if (description.IndexDescriptions != null)
            {
                var indexes = collection?.GetType().GetProperty("Indexes")?.GetValue(collection);
                if (indexes != null)
                {
                    var createOneMethodInfo = indexes.GetType().GetMethod(
                        "CreateOne",
                        new[] { typeof(IndexKeysDefinition<>).MakeGenericType(description.DocumentType), typeof(CreateIndexOptions), typeof(CancellationToken) });

                    foreach (var indexDescription in description.IndexDescriptions)
                    {
                        createOneMethodInfo?.Invoke(indexes, new[] { indexDescription.IndexKeysDefinition, indexDescription.Options, default(CancellationToken) });
                    }
                }
            }

            services.AddSingleton(collectionType, collection);
        }
    }
}

public class CollectionDescription
{
    public string Name { get; set; }
    public Type DocumentType { get; set; }
    public IList<IndexDescription> IndexDescriptions { get; set; }
}

public class IndexDescription
{
    public object IndexKeysDefinition { get; set; }
    public CreateIndexOptions Options { get; set; }
}
