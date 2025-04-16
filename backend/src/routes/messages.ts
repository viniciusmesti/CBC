import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { sendMessageHandler } from '../controllers/message.controller'; // você deve ter isso implementado

const router = Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Envia uma nova mensagem.
 *     description: Cria uma nova mensagem e enfileira para envio.
 *     tags:
 *       - Mensagens
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               recipientId:
 *                 type: string
 *               content:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [normal, urgent]
 *     responses:
 *       200:
 *         description: Mensagem criada e enfileirada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 estimatedDelivery:
 *                   type: string
 *                 cost:
 *                   type: number
 *                 currentBalance:
 *                   type: number
 */


router.post('/messages', authenticateToken, sendMessageHandler);

export default router;
