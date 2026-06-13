#!/usr/bin/env bash
# Поднимает полный стек: Postgres, Redis, Loki, Grafana.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Starting full Docker Compose stack..."
docker compose up -d

echo ""
echo "✓ Full stack ready"
echo "  Postgres:  localhost:5432"
echo "  Redis:     localhost:6379"
echo "  Loki:      http://localhost:3100"
echo "  Grafana:   http://localhost:3001  (admin / admin)"
echo ""
echo "Apps (API + Web): npm run dev"
