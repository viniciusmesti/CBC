# Big Chat Brasil (Backend)

Backend desenvolvido para o desafio técnico da Big Chat Brasil (BCB), focado na comunicação entre empresas e clientes com suporte a planos pré-pago/pós-pago, autenticação via JWT, controle de mensagens com fila de prioridade e transações financeiras.

---

## Tecnologias Utilizadas

- **Node.js + TypeScript**
- **Express.js**
- **TypeORM + PostgreSQL**
- **JWT (autenticação segura)**
- **Swagger (documentação)**
- **Docker (opcional para produção)**

---

## Funcionalidades

###  Clientes
- Cadastro automático via CPF/CNPJ
- Autenticação com geração de token JWT
- Suporte a planos: `prepaid` ou `postpaid`

### Mensagens
- Envio de mensagens com prioridade (`normal` ou `urgent`)
- Custo por mensagem: `R$ 0,25` (normal) / `R$ 0,50` (urgente)
- Fila de envio com prioridade real

### Transações
- Registro de transações financeiras por cliente
- Ajuste de `balance` ou `limit` via rota protegida
- Consulta de extrato de transações

---

## Autenticação JWT

- Gere um token via `/api/auth`
- Use `Authorization: Bearer <token>` em todas as rotas protegidas

---

## Documentação via Swagger

- Acesse: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- Inclui botão de autenticação com JWT

---

## Rodando o projeto

```bash
# Instale as dependências
npm install

# Configure seu .env
cp .env.example .env

# Inicie o servidor
npm run dev
