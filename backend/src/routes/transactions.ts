import { RequestHandler, Router } from 'express';
import {
  getClientTransactions,
  adjustClientBalanceOrLimit,
} from '../controllers/transaction.controller';

const router = Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Lista as transações financeiras do cliente autenticado.
 *     tags:
 *       - Transações
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   clientId:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   description:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [DEBIT, CREDIT]
 *                   createdAt:
 *                     type: string
 */


router.get('/transactions', getClientTransactions as RequestHandler);
router.post('/transactions/adjust', adjustClientBalanceOrLimit as RequestHandler);

export default router;
