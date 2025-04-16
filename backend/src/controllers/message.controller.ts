import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendMessage } from '../services/message.service';

export const sendMessageHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.clientId!;
    const response = await sendMessage({ ...req.body, clientId });
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};
