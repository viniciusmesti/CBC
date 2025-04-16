const urgentQueue: string[] = [];
const normalQueue: string[] = [];

export const messageQueue = {
  enqueue: (messageId: string, priority: 'urgent' | 'normal') => {
    if (priority === 'urgent') {
      urgentQueue.push(messageId);
    } else {
      normalQueue.push(messageId);
    }
    console.log(`📨 Mensagem ${messageId} adicionada à fila ${priority}`);
  },

  dequeue: (): string | undefined => {
    if (urgentQueue.length > 0) {
      return urgentQueue.shift();
    } else {
      return normalQueue.shift();
    }
  },

  getQueuesStatus: () => ({
    urgent: urgentQueue.length,
    normal: normalQueue.length,
  }),
};
