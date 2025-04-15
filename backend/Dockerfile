FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Se estiver configurando o build para produção
EXPOSE 5000
CMD ["npm", "run", "dev"]
