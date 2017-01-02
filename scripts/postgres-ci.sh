#!/bin/bash

ACTION=$1

name='podverse-postgres-ci'

case ${ACTION} in
  start)

    docker run \
    -p 127.0.0.1:5432:5432 \
    --name ${name} \
    -e POSTGRES_PASSWORD=password \
    -d kiasaki/alpine-postgres

    exit 0
    ;;

  stop)
    docker stop ${name}
    docker rm -v ${name}
    exit 0
    ;;
  *)
    exit 1
    ;;
esac
