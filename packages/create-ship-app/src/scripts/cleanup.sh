#!/usr/bin/env bash
set -e
shopt -s dotglob

api_dir="$1"
api_type="$2"
db_type="$3"

rm $api_dir/src/ApiStarter.sln

if [ "$api_type" == ".NET" ]; then
  rm $api_dir/src/ApiStarter.sln

  if [ "$db_type" == "MongoDB" ]; then
    rm -rf $api_dir/src/app/Api.Sql
    rm -rf $api_dir/src/app/Tests.Sql
    rm -rf $api_dir/src/app/Migrator.Sql
    rm -rf $api_dir/src/app/Common/DalSql
    rm -rf $api_dir/src/app/Common/MappingsSql
    rm -rf $api_dir/src/app/Common/Services/Sql
    rm $api_dir/src/app/Scheduler/appsettings.DevelopmentSql.json

    rm $api_dir/src/ApiStarterSql.sln
    mv $api_dir/src/ApiStarterNoSql.sln $api_dir/src/ApiStarter.sln

    rm $api_dir/src/docker-compose.sql.dcproj
    rm $api_dir/src/docker-compose.sql.yml
    rm $api_dir/src/docker_postgres_init.sql
  fi

  if [ "$db_type" == "PostgreSQL" ]; then
    rm -rf $api_dir/mongo-replicator
    rm -rf $api_dir/src/app/Api.NoSql
    rm -rf $api_dir/src/app/SignalR
    rm -rf $api_dir/src/app/Tests.NoSql
    rm -rf $api_dir/src/app/Migrator.NoSql
    rm -rf $api_dir/src/app/Common/Dal
    rm -rf $api_dir/src/app/Common/Mappings
    rm -rf $api_dir/src/app/Common/Services/NoSql
    rm $api_dir/src/app/Scheduler/appsettings.DevelopmentNoSql.json

    rm $api_dir/src/ApiStarterNoSql.sln
    mv $api_dir/src/ApiStarterSql.sln $api_dir/src/ApiStarter.sln

    rm $api_dir/src/docker-compose.nosql.dcproj
    rm $api_dir/src/docker-compose.nosql.yml
  fi
fi
