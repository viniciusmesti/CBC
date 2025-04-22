import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/auth';
import conversationRoutes from './routes/conversations';
import messageRoutes from './routes/messages';
import { AppDataSource } from './config/data-source';
import transactionRoutes from './routes/transactions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do CBC',
      version: '1.0.0',
      description: 'Documentação da API do projeto CBC',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            documentId: { type: 'string' },
            documentType: { type: 'string', enum: ['CPF', 'CNPJ'] },
            planType: { type: 'string', enum: ['prepaid', 'postpaid'] },
            active: { type: 'boolean' },
            balance: { type: 'number', nullable: true },
            limit: { type: 'number', nullable: true },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};



const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Backend do CBC está funcionando!');
});


AppDataSource.initialize()
  .then(() => {
    console.log('📦 Banco de dados conectado com sucesso!');

    app.use('/api', authRoutes);
    app.use('/api', conversationRoutes);
    app.use('/api', messageRoutes);
    app.use('/api', transactionRoutes);

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco de dados:', err);
  });