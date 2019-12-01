FROM node:10
WORKDIR /tmp
COPY . .
RUN npm install -g ts-node@7.0.1
RUN npm install
RUN npm run build
