FROM node:22-slim AS builder
WORKDIR /app
ARG branch
ARG commitHash
ARG dir
RUN apt update && apt install -y git
RUN git clone -b ${branch} https://${gh_token}@github.com/${owner}/${name}.git .
RUN git reset --hard ${commitHash}
WORKDIR /app/${dir}
COPY package*.json ./
RUN npm ci --silent && npm cache clean --force
COPY . .
RUN npm run build

FROM node:22-slim AS production
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]