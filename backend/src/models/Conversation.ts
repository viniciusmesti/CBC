import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './Client';
import { Message } from './Message';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Client, client => client.conversations)
  client!: Client;

  @Column()
  recipientId!: string;

  @Column()
  recipientName!: string;

  @Column({ nullable: true })
  lastMessageContent!: string;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageTime!: Date;

  @Column({ default: 0 })
  unreadCount!: number;

  @OneToMany(() => Message, message => message.conversation)
  messages!: Message[];
}
