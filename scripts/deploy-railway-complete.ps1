# Complete Railway Deployment - WeaveCode
# This script performs a complete deployment to Railway

Write-Host "COMPLETE RAILWAY DEPLOYMENT" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Check current status
Write-Host "Checking current status..." -ForegroundColor Yellow
railway status

# 2. ADD REDIS (if it doesn't exist)
Write-Host "Adding Redis..." -ForegroundColor Yellow
railway add --database redis

# 3. CONFIGURE FRONTEND VARIABLES
Write-Host "Configuring frontend..." -ForegroundColor Yellow
$backendUrl = "https://weavecoderailway-production.up.railway.app"
railway variables --service frontend --set "VITE_API_URL=$backendUrl"
railway variables --service frontend --set "NODE_ENV=production"

# 4. CONFIGURE CHATWOOT VARIABLES
Write-Host "Configuring Chatwoot..." -ForegroundColor Yellow
railway variables --service chatwoot --set "RAILS_ENV=production"
railway variables --service chatwoot --set "NODE_ENV=production"

# 5. DEPLOY ALL SERVICES
Write-Host "Deploying backend..." -ForegroundColor Yellow
cd backend
railway up
cd ..

Write-Host "Deploying frontend..." -ForegroundColor Yellow
cd frontend
railway up
cd ..

Write-Host "Deploying Chatwoot..." -ForegroundColor Yellow
cd chatwoot
railway up
cd ..

# 6. CHECK FINAL STATUS
Write-Host "DEPLOY COMPLETE!" -ForegroundColor Green
Write-Host "Final status:" -ForegroundColor Cyan
railway status

Write-Host ""
Write-Host "DEPLOY COMPLETE FINALIZED!" -ForegroundColor Green
Write-Host "All services are now running on Railway!" -ForegroundColor Green
