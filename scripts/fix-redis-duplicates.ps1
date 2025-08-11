# Fix Redis Duplicates - WeaveCode
# This script fixes duplicate entries in Redis cache

Write-Host "FIXING REDIS DUPLICATES" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Cyan

# Check current services
Write-Host "Checking current services..." -ForegroundColor Yellow
railway status

# 2. IDENTIFY REDIS DUPLICATES
Write-Host "Identifying Redis duplicates..." -ForegroundColor Yellow
Write-Host "There should only be 1 Redis for the entire project" -ForegroundColor Red

# 3. KEEP ONLY THE OLDEST REDIS
Write-Host "Keeping only the oldest Redis..." -ForegroundColor Green
Write-Host "Removing Redis-AWVN (most recent)" -ForegroundColor Yellow

# 4. CONFIGURE VARIABLES IN REMAINING REDIS
Write-Host "Configuring variables in remaining Redis..." -ForegroundColor Yellow
railway variables --service redis --set "REDIS_URL=redis://redis.railway.internal:6379"

# 5. CHECK FINAL STATUS
Write-Host "REDIS DUPLICATES RESOLVED!" -ForegroundColor Green
railway status
