# https://github.com/northflank-examples/next-js-example/blob/master/Dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json package.json
RUN yarn install
COPY . .
RUN yarn build && yarn --production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]