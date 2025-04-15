import { Request, Response } from 'express';
// Importe a função que autentica o cliente, que você criará no serviço.
import { authenticateClient } from '../services/auth.service';

/**
 * Controller para autenticar o cliente.
 * Recebe documentId e documentType e retorna um token e dados do cliente.
 */
export const authController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId, documentType } = req.body;
    // Chama o serviço de autenticação
    const authResponse = await authenticateClient(documentId, documentType);
    res.status(200).json(authResponse);
  } catch (error) {
    console.error('Error in authController:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao autenticar cliente' });
  }
};
