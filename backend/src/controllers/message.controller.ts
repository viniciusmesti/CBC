import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendMessage } from '../services/message.service';

export const sendMessageHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
      const response = await sendMessage({
        clientId: req.clientId!,
        conversationId: req.body.conversationId,
        recipientId: req.body.recipientId,
        content: req.body.content,
        priority: req.body.priority
      });
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};