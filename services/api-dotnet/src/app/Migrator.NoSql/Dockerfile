FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["app/Migrator.NoSql/Migrator.NoSql.csproj", "app/Migrator.NoSql/"]
COPY ["app/Common/Common.csproj", "app/Common/"]
RUN dotnet restore "app/Migrator.NoSql/Migrator.NoSql.csproj"
COPY . .
WORKDIR "/src/app/Migrator.NoSql"
RUN dotnet build "Migrator.NoSql.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Migrator.NoSql.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Migrator.NoSql.dll"]
