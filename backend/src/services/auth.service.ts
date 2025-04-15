import { Client } from "../models/Client";
import { AppDataSource } from "../config/data-source";

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
  const clientRepository = AppDataSource.getRepository(Client);

  // Tenta encontrar um cliente existente
  let client = await clientRepository.findOneBy({ documentId, documentType });
  if (!client) {
    // Se não existir, cria um novo cliente com valores padrão
    client = clientRepository.create({
      name: 'Novo Cliente',
      documentId,
      documentType,
      planType: 'prepaid', // valor padrão; pode ser 'postpaid' conforme regra
      active: true,
      balance: 100.0, // valor de saldo padrão para pré-pago
    });
    client = await clientRepository.save(client);
  }

  // Gera um token dummy (em produção, utilize JWT ou outra estratégia)
  const token = 'dummy-token-' + client.id;
  return { token, client };
}
