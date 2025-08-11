# Railway Migration Script
# This script migrates the project to Railway

Write-Host "Starting migration to Railway..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# 1. Check Railway CLI
Write-Host "Checking Railway CLI..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version
    Write-Host "Railway CLI found: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "Railway CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "   Run: npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}

# 2. Check Railway login
Write-Host "Checking Railway login..." -ForegroundColor Yellow
try {
    $user = railway whoami
    Write-Host "Logged in as: $user" -ForegroundColor Green
} catch {
    Write-Host "Not logged in to Railway. Please login first." -ForegroundColor Red
    Write-Host "   Run: railway login" -ForegroundColor Yellow
    exit 1
}

# 3. Create Railway project (if it doesn't exist)
Write-Host "Creating Railway project..." -ForegroundColor Yellow
try {
    $project = railway project
    Write-Host "Project: $project" -ForegroundColor Green
} catch {
    Write-Host "Failed to get project information" -ForegroundColor Red
    exit 1
}

# 4. Deploy to Railway
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
try {
    railway up
    Write-Host "Deployment completed!" -ForegroundColor Green
} catch {
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Migration to Railway completed!" -ForegroundColor Green
Write-Host "Your app is now running on Railway!" -ForegroundColor Green
