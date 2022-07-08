FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["app/Migrator.Sql/Migrator.Sql.csproj", "app/Migrator.Sql/"]
COPY ["app/Common/Common.csproj", "app/Common/"]
RUN dotnet restore "app/Migrator.Sql/Migrator.Sql.csproj"
COPY . .
WORKDIR "/src/app/Migrator.Sql"
RUN dotnet build "Migrator.Sql.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Migrator.Sql.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Migrator.Sql.dll"]
