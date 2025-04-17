import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Autentica o usuário.
 *     description: Retorna um token JWT e dados do cliente autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: string
 *               documentType:
 *                 type: string
 *                 enum: [CPF, CNPJ]
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 */
router.post('/auth', authController);


export default router;
