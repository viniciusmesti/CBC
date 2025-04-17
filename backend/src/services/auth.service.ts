import { Client } from "../models/Client";
import { AppDataSource } from "../config/data-source";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export interface AuthResponse {
  token: string;
  client: {
    id: string;
    name: string;
    documentId: string;
    documentType: 'CPF' | 'CNPJ';
    planType: 'prepaid' | 'postpaid';
    active: boolean;
    balance?: number;
    limit?: number;
  };
}

// 🔧 Agora uma função pura, recebe os dados como argumentos
export const authClient = async (
  documentId: string,
  documentType: 'CPF' | 'CNPJ',
  planType: 'prepaid' | 'postpaid'
): Promise<AuthResponse> => {
  const clientRepo = AppDataSource.getRepository(Client);

  let client = await clientRepo.findOneBy({ documentId });

  if (!client) {
    client = clientRepo.create({
      name: 'Cliente ' + documentId,
      documentId,
      documentType,
      planType,
      active: true,
      balance: planType === 'prepaid' ? 20.0 : undefined,
      limit: planType === 'postpaid' ? 100.0 : undefined,
    });
    await clientRepo.save(client);
  }

  const token = jwt.sign({ clientId: client.id }, JWT_SECRET, { expiresIn: '7d' });

  return { client, token };
};
