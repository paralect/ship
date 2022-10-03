## How to apply a migration

1. Ensure [EF Core tools](https://docs.microsoft.com/en-us/ef/core/cli/dotnet) are installed.
2. Open a terminal, go to migrator's directory and run the following command to create a migration:
```
dotnet ef migrations add [MigrationName] -o .\Migrations -- --environment Development
```
Environment is required only to provide a non-empty connection string value from appsettings.Development.json to DB context configuration. No DB requests are made at this point.
3. Run the migrator to apply the generated migration.