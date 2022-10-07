FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["app/Scheduler/Scheduler.csproj", "app/Scheduler/"]
COPY ["app/Common/Common.csproj", "app/Common/"]
RUN dotnet restore "app/Scheduler/Scheduler.csproj"
COPY . .
WORKDIR "/src/app/Scheduler"
RUN dotnet build "Scheduler.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Scheduler.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Scheduler.dll"]
