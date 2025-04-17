import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Client }       from '../models/Client';
import { Conversation } from '../models/Conversation';
import { Message }      from '../models/Message';
import { Transaction }  from '../models/Transaction';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME     || 'cbc',
  synchronize: true,
  logging: false,
  entities: [
    Client,
    Conversation,
    Message,
    Transaction
  ],
  migrations: [],
});
