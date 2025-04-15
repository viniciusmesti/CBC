import { Request, Response } from 'express';
// Importe a função de envio de mensagem do serviço
import { sendMessage } from '../services/message.service';

/**
 * Controller para envio de mensagem.
 * Recebe conversationId (ou recipientId), content e priority e retorna o status da mensagem.
 */
export const sendMessageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId, recipientId, content, priority } = req.body;
    // Chama o serviço que processa e enfileira a mensagem
    const messageResponse = await sendMessage({ conversationId, recipientId, content, priority });
    res.status(200).json(messageResponse);
  } catch (error) {
    console.error('Error in sendMessageController:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao enviar mensagem' });
  }
};
