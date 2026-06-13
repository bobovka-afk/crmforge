#!/usr/bin/env bash
# Поднимает только Postgres + Redis (ежедневная разработка).
# Backend и frontend — через scripts/dev.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Starting Postgres + Redis..."
docker compose up -d postgres redis

echo ""
echo "✓ Infra ready"
echo "  Postgres: postgresql://crmforge:crmforge@localhost:5432/crmforge"
echo "  Redis:    localhost:6379"
echo ""
echo "Next: cp .env.example .env  (if not done)"
echo "      npm run dev            (backend + frontend)"
