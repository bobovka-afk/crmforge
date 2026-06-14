#!/usr/bin/env bash
# Поднимает полный стек: Postgres, Redis, API, Web, Loki, Grafana.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Starting full Docker Compose stack..."
docker compose up -d --build

echo ""
echo "✓ Full stack ready"
echo "  Web:       http://localhost:5173"
echo "  API:       http://localhost:3000/api"
echo "  Swagger:   http://localhost:3000/api/docs"
echo "  Postgres:  localhost:5432"
echo "  Redis:     localhost:6379"
echo "  Loki:      http://localhost:3100"
echo "  Grafana:   http://localhost:3001  (admin / admin)"
echo ""
echo "Dev with hot reload (optional): npm run docker:infra && npm run dev"
