FROM node:20-slim

WORKDIR /app

COPY package.json ./

RUN corepack enable && corepack prepare yarn@stable --activate && \
    yarn install

COPY . .