#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["app/SignalR/SignalR.csproj", "app/SignalR/"]
COPY ["app/Common.Services/Common.Services.csproj", "app/Common.Services/"]
COPY ["app/Common/Common.csproj", "app/Common/"]
COPY ["app/Api.Views/Api.Views.csproj", "app/Api.Views/"]
RUN dotnet restore "app/SignalR/SignalR.csproj"
COPY . .
WORKDIR "/src/app/SignalR"
RUN dotnet build "SignalR.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SignalR.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

RUN apt-get update && apt-get install -y netcat-openbsd

COPY ["app/SignalR/bash/", "bash"]
ENTRYPOINT ["/bin/bash", "bash/setup.sh"]
