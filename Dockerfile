# Usa Node.js LTS
FROM node:18-alpine

# Cria diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install --production

# Copia o restante do código
COPY . .

# Expõe a porta do app
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
