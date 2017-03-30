#!/bin/bash

# Intended for use with webfaction

LOG_PATH=${2-server.log}
BASE_DIR=$(dirname "$(readlink -f "$0")")/..

process_cmd="node ${BASE_DIR}/src/server.js"
query_unique_pageviews="node ${BASE_DIR}/src/queryUniquePageviews($3, $4, 0).js"

case $1 in

  start)

    # Quit if already running
    if pgrep -f "${process_cmd}" > /dev/null; then exit 0; fi

    cd ${BASE_DIR}
    source ${BASE_DIR}/init_env.sh
    yarn run prestart || exit 1

    nohup ${process_cmd} &>> ${LOG_PATH} &

    echo running pid $(pgrep -f "${process_cmd}")
    ;;

  stop)

    pkill -f "${process_cmd}"

    ;;

  queryUniquePageviews)
    cd ${BASE_DIR}
    source ${BASE_DIR}/init_env.sh
    nohup ${query_unique_pageviews} &>> ${LOG_PATH}
    ;;

  *)
    echo "server start|stop|queryUniquePageviews logfile"
    ;;

esac
