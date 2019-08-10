FROM node:10
WORKDIR /tmp
COPY . .
RUN npm install -g ts-node
RUN npm install
RUN npm run build
COPY ./src/config/apple-app-site-association /tmp/next/production-server/config/apple-app-site-association
