import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({
  client: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
    }
  }, []);

  const login = async (documentId: string, documentType: 'CPF' | 'CNPJ') => {
    const response = await api.post('/auth', { documentId, documentType });
    const { client: cli, token: tok } = response.data;
    setClient(cli);
    setToken(tok);
    api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    localStorage.setItem('token', tok);
  };

  const logout = () => {
    setClient(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ client, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
