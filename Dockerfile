FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev || { echo "npm ci failed"; exit 1; }

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]