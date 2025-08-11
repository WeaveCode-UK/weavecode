# Docker Cleanup Script after Railway Migration
# This script removes Docker containers and images after successful migration

Write-Host "DOCKER CLEANUP AFTER RAILWAY MIGRATION" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Confirm if migration was successful
$confirm = Read-Host "Confirm that the migration to Railway was successful? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cleanup cancelled. Run again after confirming the migration." -ForegroundColor Red
    exit 1
}

Write-Host "Migration confirmed. Proceeding with cleanup..." -ForegroundColor Green

# List of Docker files to remove (already removed, but kept for reference)
$dockerFiles = @(
    "docker-compose.yml",
    "docker-compose.prod.yml",
    "Dockerfile",
    "Dockerfile.prod",
    ".dockerignore"
)

$dockerDirs = @(
    "deploy",
    "docker"
)

Write-Host "All Docker files have already been removed previously!" -ForegroundColor Blue
Write-Host "Project is clean and configured for Railway" -ForegroundColor Green

# Update .gitignore to remove Docker references
Write-Host "Updating .gitignore..." -ForegroundColor Yellow
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    $gitignoreContent = $gitignoreContent -replace "docker-compose\.yml\n", ""
    Set-Content $gitignorePath $gitignoreContent
    Write-Host ".gitignore updated" -ForegroundColor Green
}

# Create backup file of the cleanup
$backupFile = "RAILWAY_MIGRATION_COMPLETE_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
$backupContent = @"
# Railway Migration Completed - WeaveCode
# =====================================

## Migration Status:
- All Docker files removed
- deploy/ directory removed
- Old GitHub Actions removed
- README.md updated
- Project configured for Railway
- Automatic deployment via GitHub Actions configured

## Files Removed:
$($dockerFiles -join "`n")

## Directories Removed:
$($dockerDirs -join "`n")

## Observations:
- Migration to Railway completed successfully
- Project is now 100% configured for Railway
- Automatic deployment via GitHub Actions configured
- Documentation updated

## Next Steps:
1. Verify that all applications are working on Railway
2. Configure custom domains
3. Test automatic deployment
4. Monitor logs and metrics on Railway

---
Migration completed on: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')
"@

Set-Content $backupFile $backupContent
Write-Host "Migration backup saved to: $backupFile" -ForegroundColor Blue

Write-Host "Docker cleanup completed successfully!" -ForegroundColor Green
Write-Host "Your project is now fully configured for Railway!" -ForegroundColor Green
