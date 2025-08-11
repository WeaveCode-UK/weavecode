# Script de Migração para Railway
# WeaveCode - info@weavecode.co.uk

Write-Host "🚀 Iniciando migração para Railway..." -ForegroundColor Green

# 1. Verificar se Railway CLI está instalado
Write-Host "📋 Verificando Railway CLI..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI encontrado: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI não encontrado. Instalando..." -ForegroundColor Red
    Write-Host "Execute: npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar se está logado no Railway
Write-Host "🔐 Verificando login no Railway..." -ForegroundColor Yellow
try {
    $loginStatus = railway whoami
    Write-Host "✅ Logado como: $loginStatus" -ForegroundColor Green
} catch {
    Write-Host "❌ Não logado no Railway. Execute: railway login" -ForegroundColor Red
    exit 1
}

# 3. Criar projeto Railway (se não existir)
Write-Host "🏗️ Criando projeto Railway..." -ForegroundColor Yellow
Write-Host "Execute: railway init" -ForegroundColor Cyan

# 4. Configurar variáveis de ambiente
Write-Host "⚙️ Configurando variáveis de ambiente..." -ForegroundColor Yellow
Write-Host "Execute: railway variables set DATABASE_URL='sua-url-postgresql'" -ForegroundColor Cyan
Write-Host "Execute: railway variables set JWT_SECRET='seu-jwt-secret'" -ForegroundColor Cyan
Write-Host "Execute: railway variables set STRIPE_SECRET_KEY='sua-stripe-key'" -ForegroundColor Cyan

# 5. Deploy do backend
Write-Host "🚀 Deploy do backend..." -ForegroundColor Yellow
Write-Host "Execute: cd backend && railway up" -ForegroundColor Cyan

# 6. Deploy do frontend
Write-Host "🎨 Deploy do frontend..." -ForegroundColor Yellow
Write-Host "Execute: cd frontend && railway up" -ForegroundColor Cyan

# 7. Configurar domínios personalizados
Write-Host "🌐 Configurando domínios..." -ForegroundColor Yellow
Write-Host "Execute: railway domain" -ForegroundColor Cyan

Write-Host "✅ Migração para Railway concluída!" -ForegroundColor Green
Write-Host "📚 Consulte a documentação: https://docs.railway.app" -ForegroundColor Blue
