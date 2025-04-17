import { Request, Response } from 'express';
import { authenticateClient } from '../services/auth.service';

export async function authController(req: Request, res: Response): Promise<void> {
  console.log('▶️  POST /api/auth body:', req.body);
  try {
    const { documentId, documentType } = req.body;
    const authResponse = await authenticateClient(documentId, documentType);
    console.log('✅ authenticateClient succeeded:', authResponse);
    res.status(200).json(authResponse);
  } catch (err: any) {
    console.error('❌ Error in authenticateClient:', err);
    res
      .status(500)
      .json({ error: err.message || 'Erro interno no servidor ao autenticar cliente' });
  }
}
