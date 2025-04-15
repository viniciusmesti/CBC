import { AppDataSource } from "../config/data-source";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import { Client } from "../models/Client";
import { messageQueue } from "./messageQueue";

export interface SendMessageRequest {
  conversationId?: string;
  recipientId?: string;
  content: string;
  priority: 'normal' | 'urgent';
}

export interface SendMessageResponse {
  id: string;
  status: 'queued';
  timestamp: string;
  estimatedDelivery: string;
  cost: number;
  currentBalance?: number;    // Apenas para pré-pago (simulação)
}

export async function sendMessage(reqData: SendMessageRequest): Promise<SendMessageResponse> {
  const { conversationId, recipientId, content, priority } = reqData;
  const messageRepo = AppDataSource.getRepository(Message);
  const conversationRepo = AppDataSource.getRepository(Conversation);
  const clientRepo = AppDataSource.getRepository(Client);

  // Para este exemplo, vamos simular que o cliente está definido em uma variável dummy.
  // Na prática, você obteria o cliente a partir do token de autenticação.
  const clientId = "dummy-client-id";

  let conversation: Conversation;
  if (conversationId) {
    conversation = await conversationRepo.findOneBy({ id: conversationId }) as Conversation;
    if (!conversation) {
      throw new Error("Conversa não encontrada");
    }
  } else {
    if (!recipientId) {
      throw new Error("Deve ser fornecido conversationId ou recipientId");
    }
    // Cria nova conversa se recipientId for fornecido
    conversation = conversationRepo.create({
      client: { id: clientId } as Client,   // Cria apenas o objeto com id, visto que o relacionamento é por referência
      recipientId,
      recipientName: "Novo Contato",          // Valor padrão; idealmente, isso virá do request
      lastMessageContent: "",
      lastMessageTime: new Date(),
      unreadCount: 0,
    });
    conversation = await conversationRepo.save(conversation);
  }

  // Define o custo da mensagem com base na prioridade
  const cost = priority === 'urgent' ? 0.5 : 0.25;

  // Cria a mensagem
  let message = messageRepo.create({
    conversation,
    content,
    sentBy: { id: clientId, type: 'client' },
    timestamp: new Date(),
    priority,
    status: 'queued',
    cost,
  });
  message = await messageRepo.save(message);

  // Adiciona a mensagem na fila para processamento
  messageQueue.enqueue(message.id, priority);

  // Define uma estimativa simples de entrega (ex: 3 segundos adiante)
  const estimatedDelivery = new Date(Date.now() + 3000).toISOString();

  return {
    id: message.id,
    status: 'queued',
    timestamp: message.timestamp.toISOString(),
    estimatedDelivery,
    cost,
    currentBalance: 100.0  // Simulação; deve ser ajustado conforme o plano do cliente
  };
}
