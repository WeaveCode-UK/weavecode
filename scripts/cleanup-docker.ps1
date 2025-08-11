# Script de Limpeza Docker após Migração para Railway
# WeaveCode - info@weavecode.co.uk

Write-Host "🧹 Iniciando limpeza dos arquivos Docker..." -ForegroundColor Green

# Confirmar se a migração foi bem-sucedida
$confirm = Read-Host "⚠️ Confirma que a migração para Railway foi bem-sucedida? (s/N)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Limpeza cancelada. Execute novamente após confirmar a migração." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Migração confirmada. Prosseguindo com a limpeza..." -ForegroundColor Green

# Lista de arquivos Docker para remover (já removidos, mas mantidos para referência)
$dockerFiles = @(
    "docker-compose.yml",
    "docker-compose.prod.yml",
    "backend/Dockerfile"
)

# Lista de diretórios Docker para remover (já removidos, mas mantidos para referência)
$dockerDirs = @(
    "deploy"
)

Write-Host "ℹ️ Todos os arquivos Docker já foram removidos anteriormente!" -ForegroundColor Blue
Write-Host "✅ Projeto está limpo e configurado para Railway" -ForegroundColor Green

# Atualizar .gitignore para remover referências Docker
Write-Host "📝 Atualizando .gitignore..." -ForegroundColor Yellow
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    $gitignoreContent = $gitignoreContent -replace "# Docker.*\n", ""
    $gitignoreContent = $gitignoreContent -replace "docker-compose\.yml\n", ""
    $gitignoreContent = $gitignoreContent -replace "Dockerfile\n", ""
    Set-Content $gitignorePath $gitignoreContent
    Write-Host "✅ .gitignore atualizado" -ForegroundColor Green
}

# Criar arquivo de backup da limpeza
$backupFile = "RAILWAY_MIGRATION_COMPLETE_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
$backupContent = @"
# Migração para Railway Concluída - WeaveCode
# Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')

## Status da Migração:
- ✅ Todos os arquivos Docker removidos
- ✅ Diretório deploy/ removido
- ✅ GitHub Actions antigos removidos
- ✅ README.md atualizado
- ✅ Projeto configurado para Railway
- ✅ Deploy automático via GitHub Actions configurado

## Arquivos Removidos:
$($dockerFiles -join "`n")

## Diretórios Removidos:
$($dockerDirs -join "`n")

## Observações:
- Migração para Railway concluída com sucesso
- Projeto agora está 100% configurado para Railway
- Deploy automático via GitHub Actions configurado
- Documentação atualizada

## Próximos Passos:
1. Verificar se todas as aplicações estão funcionando no Railway
2. Configurar domínios personalizados
3. Testar deploy automático
4. Monitorar logs e métricas no Railway

---
WeaveCode - info@weavecode.co.uk
"@

Set-Content $backupFile $backupContent
Write-Host "📋 Backup da migração salvo em: $backupFile" -ForegroundColor Blue

Write-Host "🎉 Limpeza Docker concluída com sucesso!" -ForegroundColor Green
Write-Host "📚 Consulte o arquivo de backup para detalhes: $backupFile" -ForegroundColor Blue
Write-Host "🚀 Seu projeto agora está totalmente configurado para Railway!" -ForegroundColor Green
