FROM node
WORKDIR /tmp
COPY . .
RUN npm install
RUN npm run build
