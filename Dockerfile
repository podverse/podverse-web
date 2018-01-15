FROM node
WORKDIR /tmp
COPY . .
RUN npm install
RUN ["chmod", "+x", "/tmp/scripts/docker_entry_point.sh"]
RUN ["chmod", "+x", "/tmp/scripts/queryUniquePageviews.js"]
CMD ["/tmp/scripts/docker_entry_point.sh"]
