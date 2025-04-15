import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Conversation } from './Conversation';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation: Conversation | undefined;

  @Column()
  content: string | undefined;

  // Utilizamos o tipo JSON para armazenar os dados do remetente
  @Column('json')
  sentBy: { id: string; type: 'client' | 'user'; } | undefined;

  @Column({ type: 'timestamp' })
  timestamp: Date | undefined;

  @Column()
  priority: 'normal' | 'urgent' | undefined;

  @Column()
  status: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed' | undefined;

  @Column('float')
  cost: number | undefined;
}
