# Etapa de construção
FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# Etapa de execução
CMD ["npm", "start"]
