#!/bin/sh
set -e

export COREPACK_ENABLE_STRICT=0

# Kill any stale dev processes on this project's app ports
# (3001=api, 3002=web, 4000=emails preview, 4001=emails fallback, 4983=drizzle studio)
lsof -ti :3001 :3002 :4000 :4001 :4983 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Detect which DB this scaffold uses, derived from the compose file present.
# applyBackendChoice in the CLI deletes the non-selected DB's compose file,
# so exactly one of these branches matches a real scaffold.
if [ -f docker-compose.postgres.yml ]; then
  COMPOSE_FLAGS="-f docker-compose.yml -f docker-compose.postgres.yml"
  DB_SVC="postgres"
  EXTRA_SVCS="redis"
  DB_HOST_PORT=5433
  WAIT_CMD="docker compose $COMPOSE_FLAGS exec -T postgres pg_isready -U root -d api-development"
elif [ -f docker-compose.mongo.yml ]; then
  COMPOSE_FLAGS="-f docker-compose.yml -f docker-compose.mongo.yml"
  DB_SVC="mongo"
  EXTRA_SVCS="mongo-replicator redis"
  DB_HOST_PORT=27017
  WAIT_CMD="docker compose $COMPOSE_FLAGS exec -T mongo mongosh --quiet --eval db.adminCommand({ping:1})"
else
  echo "No database compose file detected — running web-only."
  exec pnpm run turbo-start
fi

# Free DB + redis host ports from any container belonging to a different scaffold.
# Our own containers (named "<project>-<svc>") are left alone so a re-run of
# `pnpm start` doesn't churn them.
PROJECT_NAME=$(basename "$PWD")
for port in "$DB_HOST_PORT" 6379; do
  for cid in $(docker ps --filter "publish=$port" -q 2>/dev/null); do
    name=$(docker inspect -f '{{.Name}}' "$cid" 2>/dev/null | sed 's|^/||')
    case "$name" in
      "${PROJECT_NAME}-"*) ;;
      *)
        echo "Port $port held by container '$name' from another scaffold — removing."
        docker rm -f "$cid" >/dev/null
        ;;
    esac
  done
done

# Bring up infra (db + redis) for this scaffold
docker compose $COMPOSE_FLAGS up -d $DB_SVC $EXTRA_SVCS

# Wait for the DB to accept connections before migrating
echo "Waiting for $DB_SVC to be ready..."
until $WAIT_CMD >/dev/null 2>&1; do
  sleep 1
done

# Apply drizzle migrations (idempotent — only runs when the api app exists
# and has drizzle.config.ts; the migrate script handles that internally)
if [ -d apps/api ]; then
  pnpm --filter api migrate
fi

echo ""
echo "──────────────────────────────────────────────────"
echo "  API:        http://localhost:3001"
echo "  API docs:   http://localhost:3001/docs"
echo "  Web:        http://localhost:3002"
echo "  Emails:     http://localhost:4000"
echo "  DB studio:  https://local.drizzle.studio (→ :4983)"
echo "──────────────────────────────────────────────────"
echo ""

# Run all dev services (API + web + scheduler + drizzle studio dashboard)
pnpm run turbo-start
