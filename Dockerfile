FROM node
WORKDIR /tmp
COPY . .
RUN npm install -g ts-node
RUN npm install
RUN npm run build
