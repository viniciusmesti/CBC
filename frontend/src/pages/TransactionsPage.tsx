import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'CREDIT' | 'DEBIT';
  createdAt: string;
}

export default function TransactionsPage() {
  const navigate = useNavigate();
  const { client } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const resp = await api.get<Transaction[]>('/transactions', {
          headers: {
            'client-id': client?.id || '',
          },
        });

        setTransactions(resp.data);
      } catch (err) {
        console.error('Erro ao carregar transações:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/conversations')}
          className="text-black hover:text-indigo-800 transition flex items-center gap-1"
        >
          ← Voltar
        </button>
        <h2 className="text-2xl font-bold">Histórico de Transações</h2>
        <div />
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{tx.description}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
              <div
                className={`text-right font-bold ${
                  tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {tx.type === 'CREDIT' ? '+' : '-'} R${tx.amount.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
