# https://github.com/northflank-examples/next-js-example/blob/master/Dockerfile

# 1. Install dependencies only when needed
FROM node:lts as dependencies

WORKDIR /app

# Install dependencies
COPY package.json package-lock* ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM node:lts as builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production image, copy all the files and run next
FROM node:lts as runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

CMD ["npm", "start"]COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]