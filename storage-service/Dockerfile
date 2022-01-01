FROM node:14.17.3-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . ./
RUN yarn build && yarn --production

FROM node:14.17.3-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD [ "node", "dist/main.js" ]
