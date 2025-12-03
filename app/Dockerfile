FROM node:22.12.0-slim AS builder
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN corepack enable
RUN yarn install
COPY . .

ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

ARG PUBLIC_CURRENT_LEAGUE
ENV PUBLIC_CURRENT_LEAGUE=$PUBLIC_CURRENT_LEAGUE

RUN yarn build

FROM node:22.12.0-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build/index.js"]

