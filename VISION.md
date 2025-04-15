# Visão do Projeto CBC (Big Chat Brasil)

## Objetivo

Desenvolver uma plataforma de chat que possibilite a comunicação eficiente entre empresas e seus clientes finais. O sistema deverá oferecer funcionalidades de autenticação, gerenciamento de conversas e envio de mensagens com tratamento diferenciado de prioridades (normal e urgente). Além disso, o sistema deve integrar um controle financeiro baseado em dois tipos de planos: pré-pago e pós-pago.

## Funcionalidades Principais

- **Autenticação de Clientes:** Permitir o login via CPF/CNPJ, gerando um token de acesso para autenticação.
- **Gerenciamento de Conversas:** Listar todas as conversas do cliente e permitir a visualização do histórico de mensagens.
- **Envio de Mensagens:** Enviar mensagens com prioridade (normal ou urgente), com validação financeira baseada no plano do cliente.
- **Processamento de Mensagens em Fila:** Enfileirar e processar as mensagens, simulando os ciclos de status (queued, processing, sent).
- **Gestão de Transações Financeiras (Opcional):** Registrar créditos e débitos para clientes de planos pré-pagos e pós-pagos.

## Metas Técnicas

- Utilizar **Node.js** com **Express** e **Typescript** no backend para garantir um servidor robusto e tipado.
- Utilizar **React** com **Vite** no frontend para uma interface moderna, rápida e responsiva.
- Implementar uma arquitetura modular e escalável, integrando as camadas de frontend e backend com um fluxo completo e coeso.
- Containerizar a aplicação com Docker para facilitar deploys e escalabilidade.
