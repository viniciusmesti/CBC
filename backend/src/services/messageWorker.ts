import { messageQueue } from './messageQueue';
import { AppDataSource } from '../config/data-source';
import { Message } from '../models/Message';

export const processMessages = async () => {
  const item = messageQueue.dequeue();
  if (!item) return;

  try {
    const messageRepository = AppDataSource.getRepository(Message);
    const msg = await messageRepository.findOneBy({ id: item.messageId });
    if (msg) {
      // Atualiza status para "processing"
      msg.status = 'processing';
      await messageRepository.save(msg);
      
      // Simulação de processamento com atraso (por exemplo, 3 segundos)
      setTimeout(async () => {
        msg.status = 'sent';
        await messageRepository.save(msg);
        console.log(`Mensagem ${msg.id} processada e enviada.`);
      }, 3000);
    }
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
  }
};
