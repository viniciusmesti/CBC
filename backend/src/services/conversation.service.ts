import { Request } from "express";
import { AppDataSource } from "../config/data-source";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";

export async function getClientConversations(
  clientId: string
): Promise<Conversation[]> {
  const repo = AppDataSource.getRepository(Conversation);
  return repo.find({
    where: { client: { id: clientId } },
    relations: ['client'],
  });
}

export async function getConversationMessages(
  clientId: string,
  conversationId: string
): Promise<Message[]> {

  const repo = AppDataSource.getRepository(Message);

  const messages = await repo
    .createQueryBuilder("message")
    .innerJoinAndSelect(
      "message.conversation",
      "conv",
      "conv.id = :conversationId AND conv.clientId = :clientId",
      { conversationId, clientId }
    )
    .orderBy("message.timestamp", "ASC")
    .getMany();

  return messages;
}
