#!/usr/bin/env bash
# Local production-style boot — no cloud account required
set -euo pipefail
cd "$(dirname "$0")/.."
cp -n .env.example .env 2>/dev/null || true
npm install
npx prisma db push
npx prisma db seed
npm run build
exec npm run start -- -p "${PORT:-3005}"
