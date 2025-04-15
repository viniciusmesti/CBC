import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Conversation } from './Conversation';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversation!: Conversation;

  @Column({ type: 'text' }) 
  content!: string;

  @Column('json')
  sentBy!: { id: string; type: 'client' | 'user' };

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @Column({ type: 'varchar' })
  priority!: 'normal' | 'urgent';

  @Column({ type: 'varchar' })
  status!: 'queued' | 'processing' | 'sent' | 'delivered' | 'read' | 'failed';

  @Column('float')
  cost!: number;
}
