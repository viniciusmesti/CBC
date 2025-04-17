// src/controllers/conversation.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getClientConversations, getConversationMessages } from '../services/conversation.service';
import { AppDataSource } from '../config/data-source';
import { Conversation } from '../models/Conversation';

export const getConversationsController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const conversations = await getClientConversations(req.clientId!);
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar conversas' });
  }
};

export const getConversationMessagesController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const clientId = req.clientId!;
    const convId = req.params.id;

    // Se alguém chamar /conversations/new/messages, convId === 'new' e esse join falha,
    // resultando em empty array, não 500.
    const messages = await getConversationMessages(clientId, convId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getConversationMessagesController:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao obter mensagens da conversa" });
  }
};

export const createConversationController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { recipientId, recipientName } = req.body;
    const clientId = req.clientId!;

    const repo = AppDataSource.getRepository(Conversation);
    const conv = repo.create({
      client: { id: clientId } as any,
      recipientId,
      recipientName,
    });
    const savedConv = await repo.save(conv);

    res.status(201).json(savedConv);
  } catch (error) {
    console.error('Error in createConversationController:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao criar conversa' });
  }
};
