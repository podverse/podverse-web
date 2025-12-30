FROM node:22-slim

WORKDIR /opt
COPY . .

RUN npm install

USER node
