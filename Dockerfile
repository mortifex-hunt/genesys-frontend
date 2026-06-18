FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
# Default port for Cloud Run
ENV PORT=8080

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build
RUN mkdir -p /app/build/server/chunks && \
    ln -s /app/build/client /app/build/server/chunks/client && \
    ln -s /app/build/prerendered /app/build/server/chunks/prerendered

EXPOSE 8080

CMD ["node", "build/index.js"]
