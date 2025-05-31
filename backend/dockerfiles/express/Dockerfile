FROM node:22-slim AS builder
WORKDIR /app
ARG owner
ARG name
ARG gh_token
ARG branch
ARG commitHash
ARG dir
RUN apt update && apt install -y git
RUN git clone -b ${branch} https://${gh_token}@github.com/${owner}/${name}.git .
RUN git reset --hard ${commitHash}
WORKDIR /app/${dir}
RUN npm ci --silent && npm cache clean --force

FROM node:22-slim AS production
WORKDIR /app
ARG owner
ARG name
ARG gh_token
ARG branch
ARG commitHash
ARG dir
RUN apt update && apt install -y git
RUN git clone -b ${branch} https://${gh_token}@github.com/${owner}/${name}.git .
RUN git reset --hard ${commitHash}
WORKDIR /app/${dir}
COPY --from=builder /app/${dir}/node_modules ./node_modules
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]