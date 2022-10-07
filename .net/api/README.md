# .NET API starter

This is a fully featured .NET 6 restful API starter application, which is configured to work with either MongoDB or PostgreSQL. The goal of this project is to solve all routine tasks and keep your focus on the product and business logic of the application, not on the common things, such as logging, configuration, dev/production environments.

## Projects

|Name|Description|
|:---|:----------|
|[API (NoSQL version)](src/app/Api.NoSql)|.NET backend starter, configured to work with MongoDB|
|[API (SQL version)](src/app/Api.Sql)|.NET backend starter, configured to work with PostgreSQL|
|[Common](src/app/Common)|DAL (for MongoDB and PostgresSQL) and some configuration, which can be shared across all applications|
|[Scheduler](src/app/Scheduler)|Background jobs runner built on Hangfire|
|[Websocket server](src/app/SignalR)|SignalR websocket server (as of now works with MongoDB only)|
|[Unit tests for NoSQL API](src/app/Tests.NoSql)|Unit tests for NoSQL API|
|[Unit tests for SQL API](src/app/Tests.Sql)|Unit tests for SQL API|

## Features

- Production ready account API resource (singup, signin, forgot password, reset password functionality), which could be backed by MongoDB or PostgreSQL
- DAL with filtering, sorting and pagination
- Unit tests
- Configured console logging ([Serilog](https://serilog.net/))
- Request data validation ([FluentValidation](https://fluentvalidation.net/))
- Object mapping ([Automapper](https://automapper.org/))
- Email sender implementation for local development (can be used with [smtp4dev](https://github.com/rnwood/smtp4dev), for example)
- Redis cache (see [CacheController](src/app/Api.NoSql/Controllers/CacheController.cs) for example of usage)
- Health checks
- [Hangfire](https://www.hangfire.io/) scheduler. Can be configure to use either MongoDB or PostgreSQL storage. Dashboard is available on http://localhost:3001/hangfire
- Feature flags support ([FeatureManagement](https://github.com/microsoft/FeatureManagement-Dotnet)). See [FeatureController](src/app/Api.NoSql/Controllers/FeatureController.cs) for example of usage)
- Docker support
- Access token based authentication
- Database migrations (SQL version only)
- SignalR websocket server (NoSQL version only)