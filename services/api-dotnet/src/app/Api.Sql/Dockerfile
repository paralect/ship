#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["app/Api.Sql/Api.Sql.csproj", "app/Api.Sql/"]
COPY ["app/Common/Common.csproj", "app/Common/"]
RUN dotnet restore "app/Api.Sql/Api.Sql.csproj"
COPY . .
WORKDIR "/src/app/Api.Sql"
RUN dotnet build "Api.Sql.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Api.Sql.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Api.Sql.dll"]