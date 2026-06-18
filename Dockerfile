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

EXPOSE 8080

CMD ["node", "build/index.js"]
