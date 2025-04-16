import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Client } from '../models/Client';
import { Transaction } from '../models/Transaction';

export const getClientTransactions = async (req: Request, res: Response) => {
  try {
    const clientId = req.headers['client-id'] as string;
    if (!clientId) {
      return res.status(400).json({ error: 'client-id não enviado no header' });
    }

    const transactionRepo = AppDataSource.getRepository(Transaction);
    const transactions = await transactionRepo.find({
      where: { clientId },
      order: { createdAt: 'DESC' }
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro ao buscar transações do cliente' });
  }
};

export const adjustClientBalanceOrLimit = async (req: Request, res: Response) => {
  try {
    const { clientId, amount, type } = req.body;

    const clientRepo = AppDataSource.getRepository(Client);
    const client = await clientRepo.findOneByOrFail({ id: clientId });

    if (type === 'balance') {
      client.balance = (client.balance ?? 0) + amount;
      await clientRepo.save(client);
    } else if (type === 'limit') {
      client.limit = (client.limit ?? 0) + amount;
      await clientRepo.save(client);
    } else {
      return res.status(400).json({ error: 'Tipo inválido. Use "balance" ou "limit".' });
    }

    // Registra transação de crédito
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const transaction = transactionRepo.create({
      clientId: client.id,
      amount,
      type: 'CREDIT',
      description: `Ajuste de ${type}`
    });
    await transactionRepo.save(transaction);
 
    return res.status(200).json({
      message: `Cliente atualizado com sucesso.`,
      client,
    });
  } catch (error) {
    console.error('Erro ao ajustar crédito/limite:', error);
    res.status(500).json({ error: 'Erro ao ajustar crédito ou limite do cliente' });
  }
};
