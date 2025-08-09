# Plano inicial – Chatwoot (Fase 2)

Objetivo: disponibilizar suporte/atendimento com experiência similar ao Chatwoot usando stack Java + Spring, com opção de widget no frontend.

## Escopo inicial
- Serviço Spring Boot (Java 17+)
- Recursos MVP:
  - Autenticação (JWT)
  - Entidades: User, Conversation, Message, Contact
  - Endpoints REST:
    - POST /auth/register, /auth/login, /auth/me
    - GET/POST /conversations, GET/POST /conversations/{id}/messages
    - GET/POST /contacts
  - WebSocket para mensagens em tempo real (STOMP)
  - Persistência: Postgres (preferível) ou MongoDB
  - Storage de anexos: S3 compatível (MinIO em dev)

## Widget Frontend
- Script embed semelhante ao Chatwoot para sites externos
- Canal de comunicação via WebSocket/REST para abrir conversa, enviar mensagens e anexos

## Integrações futuras
- Email ingress (endereços por canal)
- WhatsApp/Telegram via conectores
- SLA, tags, atribuição a agentes e relatórios

## Implantação
- Cloud (GCP/AWS) ou VPS com Docker Compose/Kubernetes
- Serviços:
  - app (Spring), db (Postgres), cache (Redis), storage (MinIO), gateway (Nginx)

## Roadmap
1. MVP REST + WebSocket + UI mínima de agente (React)
2. Import/export de dados
3. Conectores (email, WhatsApp)
4. Relatórios e automações
