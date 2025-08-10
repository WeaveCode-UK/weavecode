# 🚀 CHECKLIST DE DEPLOY - WEAVECODE VPS

## ✅ **PRÉ-REQUISITOS CONFIRMADOS**
- [x] VPS Hetzner CX32 criada (4vCPU, 8GB RAM)
- [x] IP público da VPS anotado
- [x] Chave SSH configurada
- [x] Projeto clonado localmente
- [x] GitHub Actions workflow atualizado

## 🔧 **PASSO 1: CONECTAR NA VPS**

```bash
# Conectar na VPS como root
ssh root@SEU_IP_DA_VPS

# Verificar sistema
lsb_release -a
free -h
df -h
```

## 🚀 **PASSO 2: EXECUTAR SETUP AUTOMÁTICO**

```bash
# Baixar e executar script de setup
curl -fsSL https://raw.githubusercontent.com/SEU_USUARIO/weavecode/main/deploy/vps-setup.sh -o vps-setup.sh
chmod +x vps-setup.sh
./vps-setup.sh
```

**O script irá:**
- ✅ Instalar Docker + Docker Compose
- ✅ Instalar Caddy (reverse proxy + SSL)
- ✅ Configurar firewall UFW
- ✅ Criar usuário `weavecode`
- ✅ Configurar diretórios e permissões
- ✅ Criar scripts de monitoramento
- ✅ Configurar backup automático

## 🔑 **PASSO 3: CONFIGURAR GITHUB SECRETS**

No GitHub: `Settings` > `Secrets` > `Actions`

| Secret | Valor | Descrição |
|--------|-------|-----------|
| `VPS_HOST` | `SEU_IP_DA_VPS` | IP público da VPS |
| `VPS_USER` | `weavecode` | Usuário criado pelo script |
| `VPS_SSH_KEY` | `Conteúdo da chave privada` | Chave SSH para deploy |
| `VPS_PORT` | `22` | Porta SSH (padrão) |

## 🌐 **PASSO 4: CONFIGURAR DOMÍNIO (OPCIONAL)**

```bash
# Editar Caddyfile
nano /etc/caddy/Caddyfile

# Descomentar e configurar:
# tls seu-email@weavecode.co.uk

# Reiniciar Caddy
systemctl restart caddy
```

## 🚀 **PASSO 5: DEPLOY AUTOMÁTICO**

```bash
# Push para main branch (deploy automático)
git add .
git commit -m "🚀 Deploy automático configurado"
git push origin main
```

**O GitHub Actions irá:**
1. ✅ Build do frontend
2. ✅ Build da imagem Docker
3. ✅ Deploy na VPS via SSH
4. ✅ Configuração automática
5. ✅ Health check final

## 🔍 **PASSO 6: VERIFICAR DEPLOY**

```bash
# Conectar na VPS
ssh weavecode@SEU_IP_DA_VPS

# Verificar status dos serviços
cd /opt/weavecode
docker-compose ps
docker-compose logs -f

# Health check manual
./health-check.sh

# Verificar logs
tail -f logs/health.log
```

## 📊 **SERVIÇOS ESPERADOS**

| Serviço | Porta | Status |
|---------|-------|--------|
| **Backend** | 4000 | 🟢 Rodando |
| **PostgreSQL** | 5432 | 🟢 Rodando |
| **Redis** | 6379 | 🟢 Rodando |
| **Caddy** | 80/443 | 🟢 Rodando |

## 🌐 **URLS DE ACESSO**

- **Frontend**: `http://SEU_IP_DA_VPS` (HTTP) ou `https://SEU_IP_DA_VPS` (HTTPS)
- **Backend API**: `http://SEU_IP_DA_VPS:4000`
- **Health Check**: `http://SEU_IP_DA_VPS:4000/health`

## 🔧 **COMANDOS ÚTEIS**

```bash
# Status dos serviços
docker-compose ps
docker-compose logs -f [servico]

# Reiniciar serviços
docker-compose restart [servico]

# Backup manual
./backup-postgres.sh

# Deploy manual
./deploy.sh

# Verificar recursos
htop
df -h
free -h
```

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Backend não responde**
```bash
# Verificar logs
docker-compose logs backend

# Verificar banco
docker-compose logs postgres

# Reiniciar serviços
docker-compose restart
```

### **SSL não funciona**
```bash
# Verificar Caddy
systemctl status caddy
journalctl -u caddy -f

# Verificar firewall
ufw status
```

### **Banco não conecta**
```bash
# Verificar PostgreSQL
docker-compose logs postgres
docker exec -it weavecode-postgres psql -U weavecode -d weavecode
```

## 🎯 **PRÓXIMOS PASSOS APÓS DEPLOY**

1. ✅ **Testar funcionalidades básicas**
2. 🔄 **Configurar integrações reais** (Stripe, SendGrid)
3. 🚀 **Desenvolver Chatwoot** (Java/Spring)
4. 📊 **Configurar monitoramento avançado**
5. 🌐 **Configurar domínio personalizado**

## 📞 **SUPORTE**

- **Logs**: `/opt/weavecode/logs/`
- **Backups**: `/opt/weavecode/backups/`
- **Scripts**: `/opt/weavecode/`
- **Docker**: `docker-compose logs -f`

---

**🎉 DEPLOY CONCLUÍDO!** 

O WeaveCode estará rodando na sua VPS com deploy automático via GitHub Actions! 🚀
