export interface Client {
    id: string;
    name: string;
    documentId: string;
    documentType: 'CPF' | 'CNPJ';
    planType: 'prepaid' | 'postpaid';
    balance?: number;
    limit?: number;
    active: boolean;
  }
  
  export interface Conversation {
    id: string;
    recipientId: string;
    recipientName: string;
    lastMessageContent?: string;
    lastMessageTime?: string;
    unreadCount: number;
  }
  
  export interface Message {
    id: string;
    conversationId: string;
    content: string;
    sentBy: { id: string; type: 'client' | 'user' };
    timestamp: string;
    priority: 'normal' | 'urgent';
    status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';
    cost?: number;
  }
  
  export interface SendMessageResponse {
    id: string;
    status: 'queued';
    timestamp: string;
    estimatedDelivery: string;
    cost: number;
    currentBalance?: number;
  }