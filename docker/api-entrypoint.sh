#!/bin/sh
set -e

echo "→ Running migrations..."
until npx prisma@6.19.3 migrate deploy; do
  echo "  waiting for database..."
  sleep 3
done

echo "→ Starting API..."
exec node dist/main.js
