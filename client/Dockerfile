FROM node:22-alpine3.23 AS builder

WORKDIR /src
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:22-alpine3.23 AS runner

WORKDIR /src
ENV NODE_ENV=production

USER node

COPY --from=builder --chown=node:node /src/public ./public
COPY --from=builder --chown=node:node /src/.next/standalone ./
COPY --from=builder --chown=node:node /src/.next/static ./.next/static

ENV PORT=3001
EXPOSE 3001
CMD [ "node", "server.js" ]