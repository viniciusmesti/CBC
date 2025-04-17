import { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';

interface Client {
  id: string;
  name: string;
  documentId: string;
  documentType: 'CPF' | 'CNPJ';
  planType: 'prepaid' | 'postpaid';
  balance?: number;
  limit?: number;
  active: boolean;
}

interface AuthContextData {
  client: Client | null;
  token: string | null;
  login: (documentId: string, documentType: 'CPF' | 'CNPJ') => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (documentId: string, documentType: 'CPF' | 'CNPJ') => {
    const response = await api.post('/auth', { documentId, documentType });
    const { client, token } = response.data;
    setClient(client);
    setToken(token);
    localStorage.setItem('token', token);
  };

  return (
    <AuthContext.Provider value={{ client, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

