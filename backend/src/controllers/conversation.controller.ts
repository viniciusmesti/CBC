import { Request, Response } from 'express';
// Importe as funções que listam conversas e mensagens.
import { getClientConversations, getConversationMessages } from '../services/conversation.service';

/**
 * Controller para listar as conversas do cliente autenticado.
 */
export const getConversationsController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Aqui você pode obter o cliente autenticado (via token, por exemplo)
    const conversations = await getClientConversations(req);
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error in getConversationsController:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao listar conversas' });
  }
};

/**
 * Controller para obter o histórico de mensagens de uma conversa específica.
 */
export const getConversationMessagesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversationId = req.params.id;
    const messages = await getConversationMessages(conversationId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getConversationMessagesController:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao obter mensagens da conversa' });
  }
};
