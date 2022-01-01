# FROM node:12 AS builder
FROM node:14.17.3-alpine  AS builder
#Create app directory, this is in our container/in our image
# WORKDIR /minhkien/src/app
WORKDIR /app

COPY package*.json ./

RUN npm ci

# RUN npm install

COPY . ./

RUN npm run build && npm prune --production



FROM node:14.17.3-alpine  

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD [ "node","dist/main.js" ]

# EXPOSE 8080

# CMD [ "node","dist/main" ]