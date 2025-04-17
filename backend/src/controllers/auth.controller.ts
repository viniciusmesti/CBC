import { Request, Response } from 'express';
import { authClient } from '../services/auth.service';

export async function authController(req: Request, res: Response): Promise<void> {
  console.log('▶️  POST /api/auth body:', req.body);
  try {
    const { documentId, documentType, planType } = req.body;

    if (!documentId || !documentType || !planType) {
      res.status(400).json({ error: 'Campos obrigatórios: documentId, documentType, planType' });
      return;
    }

    const authResponse = await authClient(documentId, documentType, planType);

    console.log('✅ authenticateClient succeeded:', authResponse);
    res.status(200).json(authResponse);
  } catch (err: any) {
    console.error('❌ Error in authenticateClient:', err);
    res
      .status(500)
      .json({ error: err.message || 'Erro interno no servidor ao autenticar cliente' });
  }
}
