#!/usr/bin/env bash
set -e
shopt -s dotglob

api_type="$1"
db_type="$2"

if [ "$api_type" == ".NET" ]; then
  if [ "$db_type" == "MongoDB" ]; then
    rm -rf "api/src/app/Api.Sql"
    rm -rf "api/src/app/Tests.Sql"
    rm -rf "api/src/app/Common/DalSql"
    rm -rf "api/src/app/Common/MappingsSql"
    rm -rf "api/src/app/Common/Services/Sql"
    rm "api/src/app/Scheduler/appsettings.DevelopmentSql.json"
    rm "api/src/docker-compose.sql.yml"
    rm "api/src/docker_postgres_init.sql"

    rm "api/src/ApiStarter.sln"
    rm "api/src/ApiStarterSql.sln"
    mv "api/src/ApiStarterNoSql.sln" "api/src/ApiStarter.sln"
  fi

  if [ "$db_type" == "PostgreSQL" ]; then
    rm -rf "api/mongo-replicator"
    rm -rf "api/app/Api.NoSql"
    rm -rf "api/app/SignalR"
    rm -rf "api/app/Tests.NoSql"
    rm -rf "api/src/app/Common/Dal"
    rm -rf "api/src/app/Common/Mappings"
    rm -rf "api/src/app/Common/Services/NoSql"
    rm "api/src/app/Scheduler/appsettings.DevelopmentNoSql.json"
    rm "api/src/docker-compose.nosql.yml"

    rm "api/src/ApiStarter.sln"
    rm "api/src/ApiStarterNoSql.sln"
    mv "api/src/ApiStarterSql.sln" "api/src/ApiStarter.sln"
  fi
fi
