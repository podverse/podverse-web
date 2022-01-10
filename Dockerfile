FROM node:16
WORKDIR /tmp
COPY . .
RUN npm install
RUN npm run build
