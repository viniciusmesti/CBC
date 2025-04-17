// src/pages/ConversationsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Conversation } from '../types/index'; 
import { Link } from 'react-router-dom';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { client } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const resp = await api.get<Conversation[]>('/conversations');
        setConversations(resp.data);
      } catch (err: any) {
        setError('Não foi possível carregar as conversas.');
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const formatDate = (iso: string | undefined) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header com saldo/limite */}
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Conversas</h2>
        <div className="text-sm">
          {client?.planType === 'prepaid' ? (
            <span>Saldo: <strong>R${client.balance?.toFixed(2)}</strong></span>
          ) : (
            <span>Limite: <strong>R${client.limit?.toFixed(2)}</strong></span>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={e => {
            const q = e.target.value.toLowerCase();
            setConversations(prev => prev.filter(c => c.recipientName.toLowerCase().includes(q)));
          }}
        />
      </div>

      {/* Lista de conversas */}
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {conversations.map(conv => (
            <li
              key={conv.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center"
              onClick={() => navigate(`/conversations/${conv.id}`)}
            >
              <div>
                <p className="font-medium">{conv.recipientName}</p>
                <p className="text-gray-500 text-sm truncate max-w-xs">
                  {conv.lastMessageContent || 'Sem mensagens ainda'}
                </p>
              </div>
              <div className="text-gray-400 text-xs text-right">
                <div>{formatDate(new Date(conv.lastMessageTime)?.toISOString())}</div>
                {conv.unreadCount > 0 && (
                  <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}


              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Novo Chat */}
      <button
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
        onClick={() => navigate('/conversations/new')}
        title="Nova conversa"
      >
        + Nova Conversa
      </button>
    </div>
  );
}
