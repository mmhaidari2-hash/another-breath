#!/usr/bin/env bash
# Start Cladak locally for desktop testing
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-3005}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install from https://nodejs.org (v20+)."
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node 18+ required (20+ recommended). You have $(node -v)."
  exit 1
fi

echo "==> Installing dependencies"
npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Ensure local app URL matches port
if grep -q 'NEXT_PUBLIC_APP_URL=' .env; then
  sed -i.bak "s|^NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=http://127.0.0.1:${PORT}|" .env && rm -f .env.bak
else
  echo "NEXT_PUBLIC_APP_URL=http://127.0.0.1:${PORT}" >> .env
fi

echo "==> Database"
npx prisma generate
npx prisma db push
npx prisma db seed

echo ""
echo "============================================"
echo "  Starting Cladak (dev server)"
echo "  Open:  http://127.0.0.1:${PORT}"
echo "  Owner: http://127.0.0.1:${PORT}/cofounder"
echo "  Code:  cladak-cofounder"
echo "  Login: cofounder@cladak.com / CofounderPass123!"
echo "============================================"
echo ""

# Dev server is more reliable for first desktop test (no separate build step)
exec npx next dev -p "$PORT"
