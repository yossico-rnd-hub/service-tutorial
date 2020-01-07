#!/bin/bash
set -e

#run confd
confd -onetime -backend ${CONFD_BACKEND:-env}

#run app
echo "Running application"

npm start
