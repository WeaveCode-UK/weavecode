# 🚀 Guia Completo de Configuração da VPS WeaveCode

## 📋 Pré-requisitos

- ✅ VPS Hetzner CX32 configurada
- ✅ IP público da VPS
- ✅ Chave SSH configurada
- ✅ Firewall configurado (portas 22, 80, 443)

## 🔑 Informações Necessárias

**Antes de começar, você precisará:**
- **IP da VPS**: `xxx.xxx.xxx.xxx` (substitua pelo seu IP real)
- **Usuário SSH**: `root` (padrão Hetzner)
- **Porta SSH**: `22` (padrão)

## 🚀 Passo 1: Conectar na VPS

```bash
# Conectar via SSH
ssh root@SEU_IP_DA_VPS

# Exemplo:
ssh root@123.456.789.123
```

## 🛠️ Passo 2: Executar Script de Configuração

```bash
# Baixar o script de configuração
curl -fsSL https://raw.githubusercontent.com/SEU_USUARIO/weavecode/main/deploy/vps-setup.sh -o vps-setup.sh

# Dar permissão de execução
chmod +x vps-setup.sh

# Executar o script
./vps-setup.sh
```

**O script vai:**
- ✅ Atualizar o sistema Ubuntu
- ✅ Instalar Docker e Docker Compose
- ✅ Instalar Caddy (reverse proxy + SSL)
- ✅ Configurar firewall UFW
- ✅ Criar estrutura de diretórios
- ✅ Configurar backup automático
- ✅ Configurar monitoramento

## 📁 Passo 3: Estrutura Criada

Após o script, você terá:

```
/opt/weavecode/
├── backups/          # Backups automáticos
├── logs/            # Logs do sistema
├── postgres/        # Dados PostgreSQL
├── ssl/             # Certificados SSL
├── .env             # Variáveis de ambiente
├── health-check.sh  # Script de monitoramento
└── deploy.sh        # Script de deploy
```

## 🔐 Passo 4: Configurar Variáveis de Ambiente

```bash
# Editar arquivo .env
nano /opt/weavecode/.env
```

**Configurações importantes:**
```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=SUA_CHAVE_JWT_SUPER_SECRETA
DATABASE_URL=postgresql://weavecode:weavecode123@localhost:5432/weavecode
STRIPE_SECRET_KEY=sua_chave_stripe
PAYPAL_CLIENT_ID=seu_paypal_client_id
PAYPAL_CLIENT_SECRET=seu_paypal_client_secret
SENDGRID_API_KEY=sua_chave_sendgrid
CHATWOOT_API_KEY=sua_chave_chatwoot
```

## 🌐 Passo 5: Configurar Domínio (Opcional)

**Se você tiver um domínio:**

1. **Editar Caddyfile:**
```bash
nano /etc/caddy/Caddyfile
```

2. **Substituir comentários por configuração real:**
```caddy
# De:
# tls seu-email@weavecode.co.uk

# Para:
tls seu-email@weavecode.co.uk
```

3. **Reiniciar Caddy:**
```bash
systemctl restart caddy
```

## 🐳 Passo 6: Configurar Docker Compose

```bash
# Copiar arquivo de produção
cp /opt/weavecode/docker-compose.prod.yml /opt/weavecode/docker-compose.yml

# Editar se necessário
nano /opt/weavecode/docker-compose.yml
```

## 🚀 Passo 7: Primeiro Deploy

```bash
# Ir para diretório do projeto
cd /opt/weavecode

# Executar deploy inicial
./deploy.sh
```

## 🔍 Passo 8: Verificar Funcionamento

```bash
# Verificar status dos serviços
docker ps

# Verificar logs
docker logs weavecode-backend
docker logs weavecode-postgres
docker logs weavecode-caddy

# Testar endpoints
curl http://localhost:4000/health
curl http://localhost:4000/status
```

## 📊 Passo 9: Monitoramento

**Verificar logs em tempo real:**
```bash
# Logs do backend
tail -f /opt/weavecode/logs/health.log

# Logs do Caddy
tail -f /var/log/caddy/weavecode.log

# Logs de acesso
tail -f /var/log/caddy/weavecode_access.log
```

**Verificar backups:**
```bash
# Listar backups
ls -la /opt/weavecode/backups/

# Verificar cron jobs
crontab -l
```

## 🔧 Passo 10: Configurar GitHub Actions

**No seu repositório GitHub, adicione estes Secrets:**

1. **VPS_HOST**: IP da sua VPS
2. **VPS_USER**: `root`
3. **VPS_SSH_KEY**: Sua chave SSH privada
4. **VPS_PORT**: `22`

**Como adicionar Secrets:**
1. Vá para `Settings` > `Secrets and variables` > `Actions`
2. Clique em `New repository secret`
3. Adicione cada um dos secrets acima

## 🚀 Deploy Automático

**Após configurar os Secrets:**
- Cada push para `main` vai fazer deploy automático
- Ou use `Actions` > `Deploy to VPS` > `Run workflow`

## 🔒 Segurança

**O que já está configurado:**
- ✅ Firewall UFW (portas 22, 80, 443)
- ✅ Headers de segurança no Caddy
- ✅ Rate limiting para API
- ✅ Backup automático
- ✅ Monitoramento de saúde

**Recomendações adicionais:**
- 🔑 Trocar senha padrão do PostgreSQL
- 🔑 Configurar fail2ban para SSH
- 🔑 Monitorar logs regularmente
- 🔑 Atualizar sistema regularmente

## 📞 Suporte

**Se algo der errado:**

1. **Verificar logs:**
```bash
journalctl -u caddy -f
docker logs weavecode-backend
```

2. **Reiniciar serviços:**
```bash
systemctl restart caddy
docker-compose restart
```

3. **Verificar conectividade:**
```bash
netstat -tlnp
ufw status
```

## 🎯 Próximos Passos

**Após VPS configurada:**
1. ✅ Configurar domínio real
2. ✅ Integrar Stripe/PayPal real
3. ✅ Configurar SendGrid real
4. ✅ Implementar Chatwoot
5. ✅ Monitoramento avançado

## 🎉 Parabéns!

**Sua VPS WeaveCode está configurada e pronta para produção!**

- ✅ **Backend**: Node.js + Express rodando
- ✅ **Database**: PostgreSQL configurado
- ✅ **Cache**: Redis funcionando
- ✅ **Proxy**: Caddy com SSL automático
- ✅ **Backup**: Automático diário
- ✅ **Monitoramento**: Health checks a cada 5 min
- ✅ **Deploy**: Automático via GitHub Actions

**Agora você pode focar no desenvolvimento do produto!** 🚀
