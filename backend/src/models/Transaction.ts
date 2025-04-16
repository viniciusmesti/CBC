import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Client } from './Client';
  
  export type TransactionType = 'DEBIT' | 'CREDIT';
  
  @Entity()
  export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @ManyToOne(() => Client, (client) => client.transactions)
    @JoinColumn({ name: 'clientId' })
    client!: Client;
  
    @Column()
    clientId!: string;
  
    @Column({ type: 'float' })
    amount!: number;
  
    @Column()
    description!: string;
  
    @Column({ type: 'varchar' })
    type!: TransactionType;
  
    @CreateDateColumn()
    createdAt!: Date;
  }
  