import { Request } from "express";
import { AppDataSource } from "../config/data-source";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";

export async function getClientConversations(req: Request): Promise<Conversation[]> {
  // Para fins de teste, esperamos que o ID do cliente esteja no header "client-id"
  const clientId = req.headers["client-id"] as string;
  if (!clientId) throw new Error("Header 'client-id' ausente");

  const conversationRepo = AppDataSource.getRepository(Conversation);
  // Busca todas as conversas relacionadas ao cliente (utilizando join para trazer as informações se necessário)
  const conversations = await conversationRepo.find({
    where: { client: { id: clientId } },
    relations: ["client"],
  });
  return conversations;
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const messageRepo = AppDataSource.getRepository(Message);
  // Retorna mensagens da conversa ordenadas pela timestamp
  const messages = await messageRepo.find({
    where: { conversation: { id: conversationId } },
    order: { timestamp: "ASC" },
    relations: ["conversation"],
  });
  return messages;
}
