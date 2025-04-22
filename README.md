# Big Chat Brasil (Fullstack)

Aplicação fullstack desenvolvida para o desafio técnico da Big Chat Brasil (BCB), com foco em comunicação entre empresas e clientes através de mensagens com controle de prioridade e integração de funcionalidades financeiras e de autenticação.

---

##  Tecnologias Utilizadas

### Backend
- Node.js + TypeScript
- Express.js
- TypeORM + PostgreSQL
- JWT (autenticação)
- Swagger (documentação de API)
- Docker (opcional para execução em produção)

### Frontend
- React + TypeScript
- TailwindCSS
- React Router
- Context API para autenticação e estado global
- Framer Motion (animações)

---

##  Funcionalidades Implementadas

###  Backend

####  Clientes
- Cadastro automático por CPF/CNPJ com nome padrão
- Autenticação via endpoint `/api/auth` com JWT
- Planos suportados: `prepaid` (saldo) e `postpaid` (limite)

####  Mensagens
- Envio de mensagens com prioridade `normal` ou `urgent`
- Custo por mensagem: R$ 0,25 (normal) / R$ 0,50 (urgente)
- Fila em memória com priorização por urgência
- Worker assíncrono que processa a fila continuamente
- Ciclo de vida da mensagem: `queued` → `processing` → `sent` / `failed`

####  Transações
- Registro automático de transações de débito ao enviar mensagens
- Histórico consultável por cliente via `/transactions`

####  Autenticação JWT
- Login com `documentId`, `documentType`, `planType`
- JWT com expiração de 7 dias
- Proteção de rotas com middleware de autenticação

####  Monitoramento
- Endpoint `/queue/status` para visualizar o estado da fila

---

###  Frontend

####  Autenticação
- Tela de login com CPF/CNPJ e tipo de plano
- Armazenamento local de sessão e token JWT

####  Conversas
- Listagem de conversas com nome do destinatário, última mensagem e data
- Busca inline nas conversas
- Criação de nova conversa

####  Interface de Chat
- Histórico de mensagens com bolhas visuais
- Diferenciação visual para mensagens normais e urgentes
- Campo de envio com suporte a prioridade
- Indicador de digitação simulada
- Scroll automático e animações suaves com Framer Motion

####  Histórico de Transações
- Tela dedicada com listagem de transações financeiras
- Valores destacados em verde/vermelho conforme crédito/débito
- Botão de "Voltar" estilizado para navegação intuitiva

####  UI/UX
- Design responsivo com TailwindCSS
- Componentes reutilizáveis
- Animações para envio de mensagens e interações de usuário
- Navegação fluida e feedback visual para ações

---

##  Documentação da API

Swagger disponível em:
👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Inclui todas as rotas com schemas, exemplos e autenticação via JWT.

---

##  Como Executar

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Rode o servidor
npm run dev
```

---

##  Docker (opcional)

```bash
# Execute tudo com Docker Compose
docker-compose up
```

---

##  Status da Implementação

| Módulo                    | Status       |
|--------------------------|--------------|
| Autenticação JWT         | ✅ Completo  |
| Fila com prioridade      | ✅ Completo  |
| Worker assíncrono        | ✅ Completo  |
| Planos pré/pós-pagos     | ✅ Completo  |
| Registro de transações   | ✅ Completo  |
| API documentada (Swagger)| ✅ Completo  |
| Interface de chat        | ✅ Completo  |
| Histórico de mensagens   | ✅ Completo  |
| Histórico de transações  | ✅ Completo  |
| UI responsiva            | ✅ Completo  |

---

##  Premissas e Decisões

- Utilização de fila em memória com prioridade para simular casos reais de urgência
- Worker separado com processamento contínuo para desacoplar envio do recebimento
- Simplicidade no fluxo de autenticação para foco nas regras de negócio
- Uso de Tailwind e Framer Motion para agilidade e experiência moderna

---


