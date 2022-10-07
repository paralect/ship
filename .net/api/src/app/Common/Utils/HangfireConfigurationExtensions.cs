using Hangfire;
using Hangfire.Mongo;
using Hangfire.Mongo.Migration.Strategies;
using Hangfire.Mongo.Migration.Strategies.Backup;
using Hangfire.PostgreSql;

namespace Common.Utils;

public static class HangfireConfigurationExtensions
{
    public static void ConfigureHangfireWithMongoStorage(
        this IGlobalConfiguration configuration,
        string connectionString)
    {
        configuration.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings();

        configuration.UseMongoStorage(connectionString, new MongoStorageOptions
        {
            // https://github.com/sergeyzwezdin/Hangfire.Mongo#migration
            // be careful with migration strategy when updating Hangfire.Mongo package
            // Note: migration from first to the last version across a few running instances of Scheduler and API can throw exception
            MigrationOptions = new MongoMigrationOptions
            {
                MigrationStrategy = new MigrateMongoMigrationStrategy(),
                BackupStrategy = new CollectionMongoBackupStrategy()
            },
            CheckConnection = true,
            // set to Watch for envs with replica sets
            CheckQueuedJobsStrategy = CheckQueuedJobsStrategy.TailNotificationsCollection
        });
    }
    
    public static void ConfigureHangfireWithPostgresStorage(
        this IGlobalConfiguration configuration,
        string connectionString)
    {
        configuration.UsePostgreSqlStorage(connectionString);
    }
}