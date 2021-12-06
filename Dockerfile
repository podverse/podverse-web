FROM node:12
WORKDIR /tmp
COPY . .
RUN npm install
RUN npm run build
