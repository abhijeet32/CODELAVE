FROM node:22-alpine

RUN addgroup -S sandboxgroup && adduser -S sandboxuser -G sandboxgroup

WORKDIR /app

COPY --chown=sandboxuser:sandboxgroup package.json .

RUN npm install --omit=dev

USER sandboxuser

CMD [ "node" ]