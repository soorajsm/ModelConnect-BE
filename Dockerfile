FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.2.0 && npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
