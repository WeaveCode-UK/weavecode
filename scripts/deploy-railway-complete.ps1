# 🚀 DEPLOY COMPLETO RAILWAY - WeaveCode
# Este script faz o deploy de todos os serviços no Railway

Write-Host "🚀 INICIANDO DEPLOY COMPLETO NO RAILWAY..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# 1. VERIFICAR STATUS ATUAL
Write-Host "📊 Verificando status atual..." -ForegroundColor Yellow
railway status

# 2. ADICIONAR REDIS (se não existir)
Write-Host "🗄️ Adicionando Redis..." -ForegroundColor Yellow
railway add --database redis

# 3. CONFIGURAR VARIÁVEIS DO FRONTEND
Write-Host "🌐 Configurando frontend..." -ForegroundColor Yellow
$backendUrl = "https://weavecoderailway-production.up.railway.app"
railway variables --service frontend --set "VITE_API_URL=$backendUrl"
railway variables --service frontend --set "NODE_ENV=production"

# 4. CONFIGURAR VARIÁVEIS DO CHATWOOT
Write-Host "💬 Configurando Chatwoot..." -ForegroundColor Yellow
railway variables --service chatwoot --set "RAILS_ENV=production"
railway variables --service chatwoot --set "NODE_ENV=production"

# 5. FAZER DEPLOY DE TODOS OS SERVIÇOS
Write-Host "🚀 Fazendo deploy do backend..." -ForegroundColor Yellow
cd backend
railway up
cd ..

Write-Host "🚀 Fazendo deploy do frontend..." -ForegroundColor Yellow
cd frontend
railway up
cd ..

Write-Host "🚀 Fazendo deploy do Chatwoot..." -ForegroundColor Yellow
cd chatwoot
railway up
cd ..

# 6. VERIFICAR STATUS FINAL
Write-Host "✅ DEPLOY COMPLETO!" -ForegroundColor Green
Write-Host "📊 Status final:" -ForegroundColor Cyan
railway status

Write-Host "🌐 URLs dos serviços:" -ForegroundColor Cyan
railway domain

Write-Host "🎉 DEPLOY COMPLETO FINALIZADO!" -ForegroundColor Green
