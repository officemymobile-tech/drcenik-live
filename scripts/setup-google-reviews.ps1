# Einmal-Setup: Google Places API Key + Sync + GitHub Secret
# Usage: .\scripts\setup-google-reviews.ps1 -ApiKey "AIzaSy..."

param(
  [Parameter(Mandatory = $true)]
  [string]$ApiKey
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$envPath = Join-Path $Root 'config\google-places.env'
@(
  '# Google Cloud Console → Places API (New) aktivieren',
  "GOOGLE_PLACES_API_KEY=$ApiKey"
) | Set-Content -Path $envPath -Encoding UTF8
Write-Host "Key gespeichert in config/google-places.env (gitignored)"

$env:GOOGLE_PLACES_API_KEY = $ApiKey
npm run sync-google-reviews

if (Get-Command gh -ErrorAction SilentlyContinue) {
  $auth = gh auth status 2>&1
  if ($LASTEXITCODE -eq 0) {
    gh secret set GOOGLE_PLACES_API_KEY -R officemymobile-tech/drcenik-live -b $ApiKey
    Write-Host 'GitHub Secret GOOGLE_PLACES_API_KEY gesetzt.'
  } else {
    Write-Host 'gh nicht eingeloggt – bitte: gh auth login'
  }
}

git add data/google-reviews.json config/gbp.json kontakt.html kontakt-en.html kontakt-tr.html
git commit -m "chore: sync Google reviews from Places API"
git push

Write-Host 'Fertig. Optional: cd infra/cloudflare && npx wrangler deploy && wrangler secret put GOOGLE_PLACES_API_KEY'
