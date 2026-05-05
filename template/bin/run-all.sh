#!/bin/sh
set -e

export COREPACK_ENABLE_STRICT=0

# Kill any stale processes on project ports
lsof -ti :3001 :3002 :4000 :4001 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Start all infrastructure (postgres + redis)
docker compose -f docker-compose.yml -f docker-compose.postgres.yml up -d postgres redis
sleep 3

# Run all dev services (API + web + scheduler)
pnpm run turbo-start
