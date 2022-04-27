# .NET API starter

.NET is a huge part of the Paralect history. In fact, for the first 5 years of the company .NET was a primary technology for most of the projects. We love technology and beleive it suits very well for what we do: product engineering.

This is a fully featured .NET restful API starter application, which is configured to work with either MongoDB or PostgreSQL. The goal of this project is to solve all routine tasks and keep your focus on the product and business logic of the application, not on the common things, such as logging, configuration, dev/production environments.

## Projects

|Name|Description|
|:---|:----------|
|[API (NoSQL version)](src/app/Api.NoSql)|.NET backend starter, configured to work with MongoDB|
|[API (SQL version)](src/app/Api.Sql)|.NET backend starter, configured to work with PostgreSQL|
|[API models](src/app/Api.Views)|The project to share models, mappings and validators across APIs|
|[Common](src/app/Common)|DAL (for MongoDB and PostgresSQL) and some configuration, which can be shared across all applications|
|[Services](src/app/Common.Services)|Domain/infrastructure services, shared across all applications|
|[Scheduler](src/app/Scheduler)|Hangfire scheduler|
|[Websocket server](src/app/SignalR)|SignalR websocket server (works with MongoDB only)|
|[Unit tests for NoSQL API](src/app/Tests.NoSql)|Unit tests for NoSQL API|
|[Unit tests for SQL API](src/app/Tests.Sql)|Unit tests for SQL API|

## Features

- configured console logging ([Serilog](https://serilog.net/))
- request data validation ([FluentValidation](https://fluentvalidation.net/))
- object mapping ([Automapper](https://automapper.org/))
- email sender implementation for local development (can be used with [smtp4dev](https://github.com/rnwood/smtp4dev), for example)
- Redis cache (see [CacheController](src/app/Api.NoSql/Controllers/CacheController.cs) for example of usage)
- health checks
- [Hangfire](https://www.hangfire.io/) scheduler. Can be configure to use either MongoDB or PostgreSQL storage. Dashboard is available on http://localhost:3001/hangfire
- Feature flags support ([FeatureManagement](https://github.com/microsoft/FeatureManagement-Dotnet)). See [FeatureController](src/app/Api.NoSql/Controllers/FeatureController.cs) for example of usage)
- Docker support
- production ready account API resource (singup, signin, forgot password, reset password functionality)
- access token based authentication
- database migrations (SQL version only)
- SignalR websocket server (NoSQL version only)

## How to set it up

Typically a new project will need either SQL or NoSQL DB, so it'll be necessary to make a few changes.

In case of MongoDB:
- remove Api.Sql project
- remove Tests.Sql project
- remove Common.Services.Sql folder
- remove Common.DalSql folder

In case of PostgreSQL:
- remove Api.NoSql project
- remove Tests.NoSql project
- remove Common.Services.NoSql folder
- remove Common.Dal folder

Additionally there're a few places, where it's necessary to uncomment the code or remove non-relevant comments, such as `docker-compose.yml` and `appsettings.*.json` files.