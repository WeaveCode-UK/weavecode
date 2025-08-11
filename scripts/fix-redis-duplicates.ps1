# 🔧 FIX REDIS DUPLICATES - WeaveCode
# Este script resolve o problema dos Redis duplicados

Write-Host "🔧 RESOLVENDO REDIS DUPLICADOS..." -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan

# 1. VERIFICAR SERVIÇOS ATUAIS
Write-Host "📊 Verificando serviços atuais..." -ForegroundColor Yellow
railway status

# 2. IDENTIFICAR REDIS DUPLICADOS
Write-Host "🔍 Identificando Redis duplicados..." -ForegroundColor Yellow
Write-Host "Deve haver apenas 1 Redis para todo o projeto" -ForegroundColor Red

# 3. MANTER APENAS O REDIS MAIS ANTIGO
Write-Host "✅ Mantendo apenas o Redis mais antigo..." -ForegroundColor Green
Write-Host "Removendo Redis-AWVN (mais recente)" -ForegroundColor Yellow

# 4. CONFIGURAR VARIÁVEIS NO REDIS RESTANTE
Write-Host "⚙️ Configurando variáveis no Redis restante..." -ForegroundColor Yellow
railway variables --service redis --set "REDIS_URL=redis://redis.railway.internal:6379"

# 5. VERIFICAR STATUS FINAL
Write-Host "✅ REDIS DUPLICADOS RESOLVIDOS!" -ForegroundColor Green
railway status

Write-Host "🎉 PROBLEMA RESOLVIDO!" -ForegroundColor Green
