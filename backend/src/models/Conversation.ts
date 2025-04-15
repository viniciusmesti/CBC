import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './Client';
import { Message } from './Message';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @ManyToOne(() => Client, client => client.conversations)
  client: Client | undefined;

  @Column()
  recipientId: string | undefined;

  @Column()
  recipientName: string | undefined;

  @Column({ nullable: true })
  lastMessageContent: string | undefined;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageTime: Date | undefined;

  @Column({ default: 0 })
  unreadCount: number | undefined;

  @OneToMany(() => Message, message => message.conversation)
  messages: Message[] | undefined;
}
