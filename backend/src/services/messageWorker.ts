import { messageQueue } from './messageQueue';
import { AppDataSource } from '../config/data-source';
import { Message } from '../models/Message';

export async function startMessageWorker() {
  setInterval(async () => {
    const messageId = messageQueue.dequeue();
    if (!messageId) return;

    const messageRepo = AppDataSource.getRepository(Message);
    const message = await messageRepo.findOneBy({ id: messageId });
    if (!message) {
      console.warn(`Mensagem ${messageId} não encontrada`);
      return;
    }


    message.status = 'processing';
    await messageRepo.save(message);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simula envio
    message.status = 'sent';
    await messageRepo.save(message);
    console.log(`✅ Mensagem ${messageId} enviada com sucesso!`);
  }, 1000); // processa 1 por segundo
}
