#!/bin/bash
set -e

# Run confd.
confd -onetime -backend etcdv3 -node http://etcd:2379

echo "Running application"

# Start the service, through the configured 'npm start' command.
# Please see package.json file.
npm start
