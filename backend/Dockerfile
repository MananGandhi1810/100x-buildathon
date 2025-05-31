FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm@latest-10
RUN pnpm install --prod --frozen-lockfile --silent && pnpm store prune
COPY prisma ./prisma/
RUN pnpx prisma generate

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma/
COPY . .
RUN npm i -g pnpm@latest-10
EXPOSE 3000
USER node
CMD ["pnpm", "start"]
