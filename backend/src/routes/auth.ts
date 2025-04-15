import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Autentica o usuário.
 *     description: Recebe documentId e documentType e retorna os dados do cliente e um token.
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     documentId:
 *                       type: string
 *                     documentType:
 *                       type: string
 *                     planType:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     balance:
 *                       type: number
 */
router.post('/auth', (req, res) => {
  const { documentId, documentType } = req.body;
  // Simulação da autenticação (em um cenário real, validar e consultar o cliente no BD)
  res.json({
    token: 'dummy-token',
    client: {
      id: 'client1',
      name: 'Dummy Client',
      documentId,
      documentType,
      planType: 'prepaid',
      active: true,
      balance: 100.0,
    },
  });
});

export default router;
