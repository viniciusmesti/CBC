import { AppDataSource } from "../config/data-source";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import { Client } from "../models/Client";
import { messageQueue } from "./messageQueue";
import { Transaction } from "../models/Transaction";

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
  currentBalance?: number;
}

export interface SendMessageRequest {
  clientId: string;
  conversationId?: string;
  recipientId?: string;
  content: string;
  priority: 'normal' | 'urgent';
}



// 🔄 Função auxiliar para salvar a transação
async function saveTransaction(
  clientId: string,
  amount: number,
  type: 'DEBIT' | 'CREDIT',
  description: string
) {
  const transactionRepo = AppDataSource.getRepository(Transaction);
  const transaction = transactionRepo.create({
    clientId,
    amount,
    type,
    description,
  });
  await transactionRepo.save(transaction);
}

export async function sendMessage(reqData: SendMessageRequest): Promise<SendMessageResponse> {
  const { conversationId, recipientId, content, priority } = reqData;

  const messageRepo = AppDataSource.getRepository(Message);
  const conversationRepo = AppDataSource.getRepository(Conversation);
  const clientRepo = AppDataSource.getRepository(Client);

  const clientId = "dummy-client-id"; // ← isso será substituído pelo token no futuro

  const client = await clientRepo.findOneByOrFail({ id: clientId });

  const cost = priority === 'urgent' ? 0.5 : 0.25;

  // 💰 Validação e débito de saldo/limite
  if (client.planType === 'prepaid') {
    if ((client.balance ?? 0) < cost) {
      throw new Error('Saldo insuficiente para enviar a mensagem.');
    }
    client.balance = (client.balance ?? 0) - cost;
  } else if (client.planType === 'postpaid') {
    if ((client.limit ?? 0) < cost) {
      throw new Error('Limite insuficiente para enviar a mensagem.');
    }
    client.limit = (client.limit ?? 0) - cost;
  }

  await clientRepo.save(client);

  // 💸 Registra transação de débito
  await saveTransaction(
    client.id,
    cost,
    'DEBIT',
    `Envio de mensagem ${priority}`
  );

  // 🔄 Conversa
  let conversation: Conversation;
  if (conversationId) {
    conversation = await conversationRepo.findOneByOrFail({ id: conversationId });
  } else {
    if (!recipientId) {
      throw new Error("Deve ser fornecido conversationId ou recipientId");
    }

    conversation = conversationRepo.create({
      client: { id: clientId } as Client,
      recipientId,
      recipientName: "Novo Contato",
      lastMessageContent: "",
      lastMessageTime: new Date(),
      unreadCount: 0,
    });
    conversation = await conversationRepo.save(conversation);
  }

  // ✉️ Criação da mensagem
  const message = messageRepo.create({
    conversation,
    content,
    sentBy: { id: clientId, type: 'client' },
    timestamp: new Date(),
    priority,
    status: 'queued',
    cost,
  });
  const savedMessage = await messageRepo.save(message);

  messageQueue.enqueue(savedMessage.id, priority);

  const estimatedDelivery = new Date(Date.now() + 3000).toISOString();

  return {
    id: savedMessage.id,
    status: 'queued',
    timestamp: savedMessage.timestamp.toISOString(),
    estimatedDelivery,
    cost,
    currentBalance: client.planType === 'prepaid' ? client.balance : undefined,
  };
}
