# Instalación de dependencias
FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package*.json ./

# Instalar únicamente dependencias de producción
RUN npm ci --omit=dev

# Imagen final de producción
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
COPY serviceAccountKey.json* ./

EXPOSE 3000

CMD ["node", "src/index.js"]
