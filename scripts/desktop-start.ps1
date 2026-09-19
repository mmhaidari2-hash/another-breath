# Start Cladak locally on Windows for desktop testing
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$Port = if ($env:PORT) { $env:PORT } else { "3005" }

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is required. Install from https://nodejs.org (v20+)."
  exit 1
}

Write-Host "==> Installing dependencies"
npm install

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Created .env from .env.example"
}

$envContent = Get-Content .env -Raw
if ($envContent -match "NEXT_PUBLIC_APP_URL=") {
  $envContent = $envContent -replace "NEXT_PUBLIC_APP_URL=.*", "NEXT_PUBLIC_APP_URL=http://127.0.0.1:$Port"
} else {
  $envContent += "`nNEXT_PUBLIC_APP_URL=http://127.0.0.1:$Port`n"
}
Set-Content .env $envContent

Write-Host "==> Database"
npx prisma generate
npx prisma db push
npx prisma db seed

Write-Host "==> Build"
npm run build

Write-Host ""
Write-Host "============================================"
Write-Host "  Cladak ready"
Write-Host "  Open:  http://127.0.0.1:$Port"
Write-Host "  Owner: http://127.0.0.1:$Port/cofounder"
Write-Host "  Code:  cladak-cofounder"
Write-Host "  Login: cofounder@cladak.com / CofounderPass123!"
Write-Host "============================================"
Write-Host ""

npm run start -- -p $Port
