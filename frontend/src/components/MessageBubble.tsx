import { Message } from '../types';
import { CheckCheck, Check, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const statusIcon = {
  sent: <Check size={16} />,
  delivered: <CheckCheck size={16} />,
  read: <CheckCheck size={16} color="blue" />,
  failed: <AlertCircle size={16} color="red" />,
  queued: null,
  processing: null,
};

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const isUrgent = message.priority === 'urgent';

  return (
    <div className={`my-2 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs p-2 rounded-lg shadow-md relative ${isOwnMessage ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} ${isUrgent ? 'border-2 border-red-400' : ''}`}>
        {isUrgent && <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></span>}
        <p>{message.content}</p>
        <div className="flex justify-between items-center text-xs mt-1 text-right">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwnMessage && <span className="ml-1">{statusIcon[message.status]}</span>}
        </div>
      </div>
    </div>
  );
}
