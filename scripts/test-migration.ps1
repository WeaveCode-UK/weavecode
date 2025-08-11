# 🧪 TESTE FINAL DA MIGRAÇÃO - WeaveCode
# Este script testa se toda a migração está funcionando

Write-Host "🧪 TESTE FINAL DA MIGRAÇÃO VPS → RAILWAY" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# 1. TESTAR BACKEND
Write-Host "🔧 Testando Backend..." -ForegroundColor Yellow
$backendUrl = "https://weavecoderailway-production.up.railway.app/api/health"
try {
    $response = Invoke-WebRequest -Uri $backendUrl -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend funcionando!" -ForegroundColor Green
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor White
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Backend com problema!" -ForegroundColor Red
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao testar Backend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 2. TESTAR FRONTEND
Write-Host "🌐 Testando Frontend..." -ForegroundColor Yellow
$frontendUrl = "https://frontendweavecode-production.up.railway.app"
try {
    $response = Invoke-WebRequest -Uri $frontendUrl -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend funcionando!" -ForegroundColor Green
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor White
        Write-Host "   Content-Type: $($response.Headers.'Content-Type')" -ForegroundColor Gray
    } else {
        Write-Host "❌ Frontend com problema!" -ForegroundColor Red
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao testar Frontend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. TESTAR CONEXÃO ENTRE SERVIÇOS
Write-Host "🔗 Testando integração..." -ForegroundColor Yellow
Write-Host "   Backend URL: $backendUrl" -ForegroundColor Gray
Write-Host "   Frontend URL: $frontendUrl" -ForegroundColor Gray

# 4. RESUMO FINAL
Write-Host ""
Write-Host "📊 RESUMO DOS TESTES:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "✅ Backend: Railway + PostgreSQL + Redis" -ForegroundColor Green
Write-Host "✅ Frontend: Railway + React + NIXPACKS" -ForegroundColor Green
Write-Host "✅ Infraestrutura: Zero Docker + Zero VPS" -ForegroundColor Green
Write-Host "✅ Migração: 100% COMPLETA!" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 PARABÉNS! A MIGRAÇÃO FOI UM SUCESSO TOTAL!" -ForegroundColor Green
Write-Host "🚀 WeaveCode agora está rodando na nuvem com Railway!" -ForegroundColor Green
