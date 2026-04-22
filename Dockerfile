FROM node:20-slim

WORKDIR /app

COPY package*.json ./

# Remove the cache clean, it's unnecessary and can cause hangs.
# Use --omit=dev in production, and ci for clean, reliable installs.
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
