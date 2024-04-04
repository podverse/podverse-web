FROM node:20
WORKDIR /tmp
COPY . .
RUN npm install
RUN npm run build
