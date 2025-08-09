# Script de health-check para WeaveCode
# Verifica status dos containers Docker e conectividade dos serviços

Write-Host "=== WeaveCode Health Check ===" -ForegroundColor Green
Write-Host ""

# Verificar se Docker está rodando
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
try {
    $DockerVersion = docker --version
    Write-Host "✓ Docker: $DockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker não está rodando ou não está instalado" -ForegroundColor Red
    exit 1
}

# Verificar containers rodando
Write-Host ""
Write-Host "2. Verificando containers..." -ForegroundColor Yellow
$Containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

if ($Containers -match "weavecode") {
    Write-Host "✓ Containers WeaveCode encontrados:" -ForegroundColor Green
    $Containers | Select-String "weavecode" | ForEach-Object {
        Write-Host "  $_" -ForegroundColor White
    }
} else {
    Write-Host "✗ Nenhum container WeaveCode encontrado" -ForegroundColor Red
    Write-Host "Execute: docker-compose up -d" -ForegroundColor Yellow
}

# Verificar conectividade do PostgreSQL
Write-Host ""
Write-Host "3. Verificando PostgreSQL..." -ForegroundColor Yellow
$PostgresContainer = docker ps --filter "name=weavecode-postgres" --format "{{.Names}}"

if ($PostgresContainer) {
    try {
        # Testar conexão com o banco
        $TestConnection = docker exec weavecode-postgres psql -U postgres -d weavecode -c "SELECT version();" 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL: Conectado e funcionando" -ForegroundColor Green
            $TestConnection | Select-String "PostgreSQL" | ForEach-Object {
                Write-Host "  $_" -ForegroundColor White
            }
        } else {
            Write-Host "✗ PostgreSQL: Erro na conexão" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ PostgreSQL: Erro ao testar conexão" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Container PostgreSQL não encontrado" -ForegroundColor Red
}

# Verificar conectividade do Backend
Write-Host ""
Write-Host "4. Verificando Backend..." -ForegroundColor Yellow
$BackendContainer = docker ps --filter "name=weavecode-backend" --format "{{.Names}}"

if ($BackendContainer) {
    try {
        # Testar endpoint de health
        $HealthResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/health" -TimeoutSec 5 2>$null
        
        if ($HealthResponse.StatusCode -eq 200) {
            Write-Host "✓ Backend: API respondendo (Status: $($HealthResponse.StatusCode))" -ForegroundColor Green
            $ResponseBody = $HealthResponse.Content | ConvertFrom-Json
            Write-Host "  Database: $($ResponseBody.database)" -ForegroundColor White
            Write-Host "  Timestamp: $($ResponseBody.timestamp)" -ForegroundColor White
        } else {
            Write-Host "✗ Backend: Status inesperado ($($HealthResponse.StatusCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Backend: Não foi possível conectar na porta 4000" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Container Backend não encontrado" -ForegroundColor Red
}

# Verificar conectividade do Frontend
Write-Host ""
Write-Host "5. Verificando Frontend..." -ForegroundColor Yellow
try {
    $FrontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 2>$null
    
    if ($FrontendResponse.StatusCode -eq 200) {
        Write-Host "✓ Frontend: Respondendo na porta 5173" -ForegroundColor Green
    } else {
        Write-Host "✗ Frontend: Status inesperado ($($FrontendResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Frontend: Não foi possível conectar na porta 5173" -ForegroundColor Red
    Write-Host "Execute: cd frontend && npm run dev" -ForegroundColor Yellow
}

# Verificar uso de recursos
Write-Host ""
Write-Host "6. Uso de recursos..." -ForegroundColor Yellow
$SystemInfo = Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory
$MemoryGB = [math]::Round($SystemInfo.TotalPhysicalMemory / 1GB, 2)
Write-Host "✓ Sistema: $($SystemInfo.WindowsProductName) $($SystemInfo.WindowsVersion)" -ForegroundColor Green
Write-Host "✓ Memória: $MemoryGB GB" -ForegroundColor Green

# Verificar espaço em disco
$DiskInfo = Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DeviceID -eq "C:" }
$FreeSpaceGB = [math]::Round($DiskInfo.FreeSpace / 1GB, 2)
$TotalSpaceGB = [math]::Round($DiskInfo.Size / 1GB, 2)
Write-Host "✓ Disco C: $FreeSpaceGB GB livres de $TotalSpaceGB GB" -ForegroundColor Green

Write-Host ""
Write-Host "=== Health Check Concluído ===" -ForegroundColor Green
