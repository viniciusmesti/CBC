import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Conversation } from './Conversation';
import { Transaction } from './Transaction';


@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  documentId!: string;

  @Column()
  documentType!: 'CPF' | 'CNPJ';

  @Column()
  planType!: 'prepaid' | 'postpaid';

  @Column({ default: true })
  active!: boolean;

  @Column('float', { nullable: true })
  balance?: number; // Disponível para clientes no plano pré-pago

  @Column('float', { nullable: true })
  limit?: number;   // Disponível para clientes no plano pós-pago

  @OneToMany(() => Conversation, conversation => conversation.client)
  conversations!: Conversation[];

  @OneToMany(() => Transaction, (transaction) => transaction.client)
  transactions!: Transaction[];
  

}
