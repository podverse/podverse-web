FROM node
WORKDIR /tmp
COPY . .
RUN npm install
RUN ["chmod", "+x", "/tmp/scripts/docker_entry_point.sh"]
CMD ["/tmp/scripts/docker_entry_point.sh"]
