FROM node:22.12.0-alpine as builder
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN corepack enable
# RUN yarn add -D dotenv-cli
RUN yarn install
COPY . .
# ENV PUBLIC_API_URL=https://timelesshistorian.xyz

# RUN dotenv yarn build
RUN yarn build

FROM node:22.12.0-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build/index.js"]

