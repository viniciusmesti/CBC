import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Importação das rotas (que serão implementadas abaixo)
import authRoutes from './routes/auth';
import conversationRoutes from './routes/conversations';
import messageRoutes from './routes/messages';
import { AppDataSource } from './config/data-source';
import { processMessages } from './services/messageWorker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Configuração do Swagger
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
  },
  // Ajuste os caminhos conforme a localização dos seus arquivos com os comentários JSDoc
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas básicas
app.get('/', (req, res) => {
  res.send('Backend do CBC está funcionando!');
});

// Uso das rotas da API
app.use('/api', authRoutes);
app.use('/api', conversationRoutes);
app.use('/api', messageRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});


AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => console.error('Erro ao conectar ao banco de dados', error));

  setInterval(processMessages, 5000);
  