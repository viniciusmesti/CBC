import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { motion } from 'framer-motion';

export default function NewConversationPage() {
  const [recipientName, setRecipientName] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!recipientId.trim() && !recipientName.trim()) {
      setError('Informe ID ou nome do contato');
      return;
    }
    setLoading(true);
    try {
      const resp = await api.post('/conversations', {
        recipientId,
        recipientName
      });
      const newConv = resp.data;
      navigate(`/conversations/${newConv.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Falha ao criar conversa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Nova Conversa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID do Contato</label>
            <input
              type="text"
              value={recipientId}
              onChange={e => setRecipientId(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="UUID ou identificador"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Contato</label>
            <input
              type="text"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ex: João Silva"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/conversations')}
              className="text-gray-600 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Conversa'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}