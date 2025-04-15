import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Envia uma nova mensagem.
 *     description: Permite enviar uma mensagem especificando conversationId ou recipientId, content e priority.
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
 *         description: Mensagem enfileirada com sucesso.
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
 */
router.post('/messages', (req, res) => {
  const { conversationId, recipientId, content, priority } = req.body;
  // Simulação da criação de uma mensagem
  const message = {
    id: 'msg' + Math.floor(Math.random() * 1000),
    conversationId: conversationId || 'conv-new',
    content,
    sentBy: { id: 'client1', type: 'client' },
    timestamp: new Date().toISOString(),
    priority,
    status: 'queued',
    cost: priority === 'urgent' ? 0.5 : 0.25,
    estimatedDelivery: new Date(Date.now() + 3000).toISOString(),
  };
  // Aqui, em um cenário real, a mensagem seria enfileirada para processamento
  res.json(message);
});

export default router;
