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
  const { client } = useAuth();

  if (id === 'new') {
    navigate('/conversations');
    return null;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState('');
  const [sending, setSending] = useState(false);
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
        priority: 'normal'
      });

      setMessages(prev => [
        ...prev,
        {
          id: resp.data.id,
          conversationId: id!,
          content: newText,
          sentBy: { id: client!.id, type: 'client' },
          timestamp: resp.data.timestamp,
          priority: 'normal',
          status: resp.data.status,
          cost: resp.data.cost
        }
      ]);

      setNewText('');
      scrollToBottom();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center p-4 bg-white shadow">
        <button onClick={() => navigate('/conversations')} className="mr-4">←</button>
        <h2 className="text-lg font-bold">Chat</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MessageBubble
              message={msg}
              isOwnMessage={msg.sentBy.id === client?.id}
            />
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 bg-white flex">
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-slate-300"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-cyan-400 text-white rounded-full px-4 disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
