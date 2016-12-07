#!/bin/bash

# Intended for use with webfaction

LOG_PATH=${2-server.log}
BASE_DIR=$(dirname "$(readlink -f "$0")")/..

process_cmd="node ${BASE_DIR}/src/server.js"

case $1 in 

  start)

    # Quit if already running
    if pgrep -f "${process_cmd}" > /dev/null; then exit 0; fi
    
    source ${BASE_DIR}/init_env.sh

    cd ${BASE_DIR}
    yarn run prestart

    nohup ${process_cmd} &>> ${LOG_PATH} &

    echo running pid $(pgrep -f "${process_cmd}")
    ;;

  stop)
    
    pkill -f "${process_cmd}"
    
    ;;

  *)
    echo "server start|stop logfile"
    ;;

esac




