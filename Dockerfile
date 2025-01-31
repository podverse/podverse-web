FROM node:20
WORKDIR /tmp
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
