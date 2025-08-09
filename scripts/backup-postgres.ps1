# Script de backup do PostgreSQL para WeaveCode
# Uso: .\backup-postgres.ps1 [database_name] [backup_dir]

param(
    [string]$DatabaseName = "weavecode",
    [string]$BackupDir = ".\backups"
)

# Criar diretório de backup se não existir
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force
}

# Nome do arquivo de backup com timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\${DatabaseName}_${Timestamp}.sql"

# Verificar se PostgreSQL está rodando via Docker
$PostgresContainer = docker ps --filter "name=weavecode-postgres" --format "table {{.Names}}" | Select-String "weavecode-postgres"

if ($PostgresContainer) {
    Write-Host "PostgreSQL container encontrado. Iniciando backup..."
    
    # Executar backup via pg_dump dentro do container
    docker exec weavecode-postgres pg_dump -U postgres -d $DatabaseName > $BackupFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup criado com sucesso: $BackupFile"
        
        # Mostrar tamanho do arquivo
        $FileSize = (Get-Item $BackupFile).Length
        $FileSizeMB = [math]::Round($FileSize / 1MB, 2)
        Write-Host "Tamanho do backup: $FileSizeMB MB"
        
        # Limpar backups antigos (manter apenas os últimos 7 dias)
        $CutoffDate = (Get-Date).AddDays(-7)
        Get-ChildItem $BackupDir -Filter "*.sql" | Where-Object { $_.LastWriteTime -lt $CutoffDate } | Remove-Item -Force
        
        Write-Host "Backups antigos removidos (mais de 7 dias)"
    } else {
        Write-Error "Erro ao criar backup. Verifique se o container está rodando."
        exit 1
    }
} else {
    Write-Error "Container PostgreSQL não encontrado. Verifique se o Docker Compose está rodando."
    Write-Host "Execute: docker-compose up -d"
    exit 1
}
