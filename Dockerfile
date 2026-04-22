FROM node:20-slim

WORKDIR /app

RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./

RUN yarn install --immutable

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]