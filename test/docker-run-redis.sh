#!/bin/bash

#docker pull redis
docker stop my_redis
docker rm my_redis
docker run -d -p 6379:6379 --name my_redis redis

