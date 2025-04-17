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
  setClient: (client: Client | null) => void;
  token: string | null;
  login: (documentId: string, documentType: 'CPF' | 'CNPJ', planType: 'prepaid' | 'postpaid') => Promise<void>;
  logout: () => void;
  loadingAuth: boolean;
}


const AuthContext = createContext<AuthContextData>({
  client: null,
  setClient: () => {},
  token: null,
  login: async () => {},
  logout: () => {},
  loadingAuth: true
});


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedClient = localStorage.getItem('client');
  
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
    }
  
    if (storedClient) {
      setClient(JSON.parse(storedClient));
    }
  
    setLoadingAuth(false); 
  }, []);
  

  useEffect(() => {
    if (client) {
      localStorage.setItem('client', JSON.stringify(client));
    }
  }, [client]);

  const login = async (documentId: string, documentType: 'CPF' | 'CNPJ', planType: 'prepaid' | 'postpaid') => {
    const response = await api.post('/auth', { documentId, documentType, planType });
    const { client: cli, token: tok } = response.data;
    setClient(cli);
    setToken(tok);
    api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    localStorage.setItem('token', tok);
    localStorage.setItem('client', JSON.stringify(cli));
  };
  

  const logout = () => {
    setClient(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('client');
  };

  return (
    <AuthContext.Provider
      value={{ client, setClient, token, login, logout, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
