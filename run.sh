#!/bin/bash
set -e

# Run confd, the CONFD_BACKEND is an environment variable that is passed to the docker on run.
confd -onetime -backend ${CONFD_BACKEND:-env}

echo "Running application"

# Start the service, through the configured 'npm start' command.
# Please see package.json file.
npm start
