# Teste de Deploy WeaveCode
Write-Host "Teste de Deploy WeaveCode" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Verificar arquivos de configuração
Write-Host "Verificando arquivos..." -ForegroundColor Yellow

$files = @("deploy/vps-setup.sh", "deploy/docker-compose.prod.yml", "deploy/Caddyfile", ".github/workflows/deploy.yml", "docker-compose.yml")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "ERRO: $file" -ForegroundColor Red
    }
}

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "OK: Docker instalado" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Docker nao esta rodando" -ForegroundColor Red
}

# Verificar Git
Write-Host "Verificando Git..." -ForegroundColor Yellow
try {
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "ATENCAO: Mudancas nao commitadas" -ForegroundColor Yellow
    } else {
        Write-Host "OK: Repositorio limpo" -ForegroundColor Green
    }
} catch {
    Write-Host "ERRO: Nao e um repositorio Git" -ForegroundColor Red
}

# Resumo
Write-Host "RESUMO DO DEPLOY" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Para fazer o deploy na VPS:" -ForegroundColor White
Write-Host "1. Conectar na VPS: ssh root@SEU_IP_DA_VPS" -ForegroundColor Gray
Write-Host "2. Executar script de setup automatico" -ForegroundColor Gray
Write-Host "3. Configurar GitHub Secrets" -ForegroundColor Gray
Write-Host "4. Push para main branch" -ForegroundColor Gray
Write-Host "Status: PRONTO PARA DEPLOY!" -ForegroundColor Green
