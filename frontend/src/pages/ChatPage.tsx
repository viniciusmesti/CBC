import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Message, SendMessageResponse } from '../types';
import { motion } from 'framer-motion';
import MessageBubble from '../components/MessageBubble';

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, setClient  } = useAuth();

  if (id === 'new') {
    navigate('/conversations');
    return null;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState('');
  const [sending, setSending] = useState(false);
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMessages() {
      try {
        const resp = await api.get<Message[]>(`/conversations/${id}/messages`);
        setMessages(resp.data);
        scrollToBottom();
      } catch (error) {
        console.error(error);
      }
    }
    loadMessages();
  }, [id]);

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }
  

  const handleSend = async () => {
    if (!newText.trim()) return;
    setSending(true);
    try {
      const resp = await api.post<SendMessageResponse>('/messages', {
        conversationId: id!,
        content: newText,
        priority,
      });
  
      // Atualiza saldo após envio
      if (resp.data.currentBalance !== undefined && client?.planType === 'prepaid') {
        setClient({ ...client, balance: resp.data.currentBalance });
      }
  
      setMessages((prev) => [
        ...prev,
        {
          id: resp.data.id,
          conversationId: id!,
          content: newText,
          sentBy: { id: client!.id, type: 'client' },
          timestamp: resp.data.timestamp,
          priority,
          status: resp.data.status,
          cost: resp.data.cost,
        },
      ]);
  
      setNewText('');
      setPriority('normal');
      scrollToBottom();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };
  

  return (
    <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <div className="flex items-center">
            <button onClick={() => navigate('/conversations')} className="mr-4">
              ←
            </button>
            <h2 className="text-lg font-bold">Chat</h2>
          </div>
          <div className="text-sm text-right">
            {client?.planType === 'prepaid' ? (
              <span>Saldo: <strong>R${client.balance?.toFixed(2)}</strong></span>
            ) : (
              <span>Limite: <strong>R${client.limit?.toFixed(2)}</strong></span>
            )}
          </div>
        </header>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MessageBubble message={msg} isOwnMessage={msg.sentBy.id === client?.id} />
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white flex items-center gap-2">
        <select
          className="border rounded-full px-3 py-2 bg-slate-200 focus:outline-none"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgente ⚠️</option>
        </select>

        <input
          type="text"
          value={newText}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !sending) handleSend();
          }}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-slate-300"
          placeholder="Digite sua mensagem..."
        />

        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-cyan-400 text-white rounded-full px-4 py-2 disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
