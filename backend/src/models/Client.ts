import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Conversation } from './Conversation';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column()
  name: string | undefined;

  @Column({ unique: true })
  documentId: string | undefined;

  @Column()
  documentType: 'CPF' | 'CNPJ' | undefined;

  @Column()
  planType: 'prepaid' | 'postpaid' | undefined;

  @Column({ default: true })
  active: boolean | undefined;

  @Column('float', { nullable: true })
  balance?: number; // Disponível para pré-pago

  @Column('float', { nullable: true })
  limit?: number;   // Disponível para pós-pago

  @OneToMany(() => Conversation, conversation => conversation.client)
  conversations: Conversation[] | undefined;
}
