type MessageQueueItem = {
    messageId: string;
  };
  
  class MessageQueue {
    private normalQueue: MessageQueueItem[] = [];
    private urgentQueue: MessageQueueItem[] = [];
  
    enqueue(messageId: string, priority: 'normal' | 'urgent') {
      if (priority === 'urgent') {
        this.urgentQueue.push({ messageId });
      } else {
        this.normalQueue.push({ messageId });
      }
    }
  
    dequeue(): MessageQueueItem | null {
      // Prioriza mensagens urgentes
      if (this.urgentQueue.length > 0) {
        return this.urgentQueue.shift()!;
      }
      if (this.normalQueue.length > 0) {
        return this.normalQueue.shift()!;
      }
      return null;
    }
  
    getQueues() {
      return {
        urgentQueue: [...this.urgentQueue],
        normalQueue: [...this.normalQueue]
      };
    }
  }
  
  export const messageQueue = new MessageQueue();
  