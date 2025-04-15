import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Lista as conversas do cliente autenticado.
 *     responses:
 *       200:
 *         description: Lista de conversas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   recipientId:
 *                     type: string
 *                   recipientName:
 *                     type: string
 *                   lastMessageContent:
 *                     type: string
 *                   lastMessageTime:
 *                     type: string
 *                   unreadCount:
 *                     type: number
 */
router.get('/conversations', (req, res) => {
  // Simulando dados de conversas (em memória)
  const conversations = [
    {
      id: 'conv1',
      recipientId: 'recipient1',
      recipientName: 'John Doe',
      lastMessageContent: 'Olá, tudo bem?',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 1,
    },
    {
      id: 'conv2',
      recipientId: 'recipient2',
      recipientName: 'Jane Doe',
      lastMessageContent: 'Como posso ajudar?',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    },
  ];
  res.json(conversations);
});

/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   get:
 *     summary: Retorna o histórico de mensagens da conversa.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa
 *     responses:
 *       200:
 *         description: Lista de mensagens da conversa.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   conversationId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   sentBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [client, user]
 *                   timestamp:
 *                     type: string
 *                   priority:
 *                     type: string
 *                     enum: [normal, urgent]
 *                   status:
 *                     type: string
 *                     enum: [queued, processing, sent, delivered, read, failed]
 *                   cost:
 *                     type: number
 */
router.get('/conversations/:id/messages', (req, res) => {
  const conversationId = req.params.id;
  // Simulando dados de mensagens para a conversa indicada
  const messages = [
    {
      id: 'msg1',
      conversationId,
      content: 'Olá, esse é um teste!',
      sentBy: { id: 'client1', type: 'client' },
      timestamp: new Date().toISOString(),
      priority: 'normal',
      status: 'sent',
      cost: 0.25,
    },
    {
      id: 'msg2',
      conversationId,
      content: 'Resposta automática.',
      sentBy: { id: 'recipient1', type: 'user' },
      timestamp: new Date().toISOString(),
      priority: 'normal',
      status: 'sent',
      cost: 0.25,
    },
  ];
  res.json(messages);
});

export default router;
