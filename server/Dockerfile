FROM node:22-alpine3.23 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev --legacy-peer-deps

FROM node:22-alpine3.23 AS runner

WORKDIR /app
ENV NODE_ENV=production

USER node

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/src/generated/prisma ./dist/generated/prisma
COPY --from=builder --chown=node:node /app/prisma ./prisma

EXPOSE 3000
CMD [ "node", "dist/main.js" ]