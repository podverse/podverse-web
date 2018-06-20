FROM node
WORKDIR /tmp
COPY . .
RUN npm install && npm install -g mocha
RUN ["chmod", "+x", "/tmp/scripts/docker_entry_point.sh"]
RUN ["chmod", "+x", "/tmp/scripts/queryUniquePageviews.js"]
RUN ["chmod", "+x", "/tmp/scripts/test.js"]