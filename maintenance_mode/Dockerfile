FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
ADD conf.d/* /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html
COPY html/. /usr/share/nginx/html
