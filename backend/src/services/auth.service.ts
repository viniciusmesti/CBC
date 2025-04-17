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

export async function authenticateClient(
  documentId: string,
  documentType: 'CPF' | 'CNPJ'
): Promise<AuthResponse> {
  console.log("🔑 authenticateClient()", { documentId, documentType });

  try {
    const clientRepo = AppDataSource.getRepository(Client);

    let client = await clientRepo.findOneBy({ documentId, documentType });
    console.log("🏷️  client found:", client);

    if (!client) {
      console.log("➕ Creating new client");
      client = clientRepo.create({
        name: 'Novo Cliente',
        documentId,
        documentType,
        planType: 'prepaid',
        active: true,
        balance: 100.0,
      });
      client = await clientRepo.save(client);
      console.log("💾 New client saved:", client);
    }

    const token = jwt.sign({ clientId: client.id }, JWT_SECRET, { expiresIn: '1h' });
    console.log("🛡️  JWT generated:", token);

    return { token, client };
  } catch (err: any) {
    console.error("❌ Error inside authenticateClient:", err);
    throw err;  // propaga para o controller, que já imprime
  }
}
