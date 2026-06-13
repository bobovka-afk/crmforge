#!/usr/bin/env bash
# Поднимает backend (Nest) и frontend (Vite) локально.
# Ожидает, что Postgres + Redis уже запущены (scripts/infra.sh).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "⚠  .env not found. Run: cp .env.example .env"
  exit 1
fi

# Optional: warn if infra is down
if ! docker compose ps postgres 2>/dev/null | grep -q "running"; then
  echo "⚠  Postgres container not running."
  echo "   Start infra: npm run docker:infra"
  echo ""
fi

WEB_DIR="$ROOT/apps/web"
HAS_WEB=false
if [[ -f "$WEB_DIR/package.json" ]]; then
  HAS_WEB=true
fi

echo "→ Starting CRMForge apps..."
echo "   API: http://localhost:3000/api"
if $HAS_WEB; then
  echo "   Web: http://localhost:5173"
else
  echo "   Web: (not scaffolded yet — only API will start)"
fi
echo ""

if $HAS_WEB; then
  exec npx concurrently \
    --names "api,web" \
    --prefix-colors "blue,green" \
    "npm run start:dev" \
    "npm run dev:web"
else
  exec npm run start:dev
fi
