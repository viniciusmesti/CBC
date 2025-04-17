import { AppDataSource } from "../config/data-source";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import { Client } from "../models/Client";
import { Transaction } from "../models/Transaction";
import { messageQueue } from "./messageQueue";

export interface SendMessageRequest {
  clientId:       string;
  conversationId?: string;
  recipientId?:   string;
  content:        string;
  priority:       'normal' | 'urgent';
}

export interface SendMessageResponse {
  id:                string;
  status:            'queued';
  timestamp:         string;
  estimatedDelivery: string;
  cost:              number;
  currentBalance?:   number;
}

// salva transação financeira
async function saveTransaction(
  clientId: string,
  amount:   number,
  type:     'DEBIT' | 'CREDIT',
  description: string
) {
  const repo = AppDataSource.getRepository(Transaction);
  const tx   = repo.create({ clientId, amount, type, description });
  await repo.save(tx);
}

export async function sendMessage({
  clientId,
  conversationId,
  recipientId,
  content,
  priority
}: SendMessageRequest): Promise<SendMessageResponse> {
  const messageRepo      = AppDataSource.getRepository(Message);
  const conversationRepo = AppDataSource.getRepository(Conversation);
  const clientRepo       = AppDataSource.getRepository(Client);

  // recupera cliente real
  const client = await clientRepo.findOneByOrFail({ id: clientId });
  const cost   = priority === 'urgent' ? 0.5 : 0.25;

  // débito de saldo/limite
  if (client.planType === 'prepaid') {
    if ((client.balance ?? 0) < cost) throw new Error('Saldo insuficiente');
    client.balance! -= cost;
  } else {
    if ((client.limit ?? 0) < cost) throw new Error('Limite insuficiente');
    client.limit! -= cost;
  }
  await clientRepo.save(client);

  // registra débito
  await saveTransaction(clientId, cost, 'DEBIT', `Envio de mensagem ${priority}`);

  // garante a conversa
  let conversation: Conversation;
  if (conversationId) {
    conversation = await conversationRepo.findOneByOrFail({ id: conversationId });
  } else {
    if (!recipientId) throw new Error("conversationId ou recipientId obrigatórios");
    conversation = conversationRepo.create({
      client:          { id: clientId } as Client,
      recipientId,
      recipientName:   "Novo Contato",
      lastMessageContent: "",
      lastMessageTime: new Date(),
      unreadCount:     0,
    });
    conversation = await conversationRepo.save(conversation);
  }

  // cria e enfileira mensagem
  const message = messageRepo.create({
    conversation,
    content,
    sentBy: { id: clientId, type: 'client' },
    timestamp: new Date(),
    priority,
    status: 'queued',
    cost,
  });
  const saved = await messageRepo.save(message);
  messageQueue.enqueue(saved.id, priority);

  return {
    id: saved.id,
    status: 'queued',
    timestamp: saved.timestamp.toISOString(),
    estimatedDelivery: new Date(Date.now() + 3000).toISOString(),
    cost,
    currentBalance: client.planType === 'prepaid' ? client.balance : undefined
  };
}
