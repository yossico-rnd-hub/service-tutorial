# Docker Quick Intro

## Stages To Get It Work

* Build a docker image.
* Create a docker container.
* Run the container.

## From Build To Run - Commands

* Build a docker image:
  ```sh 
  docker build -t tutorial-svc . 
   ```
   * This builds the docker according to the docker file.
   * The build will result in a *docker image*, please run ``` docker images ``` and see that the docker image is created.
   * This will tag it with the name *tutorial-svc* and version *latest*.
   * To be able to run this command, you have to set the current directory to the root of the service (where your dockerfile is located).
* Once docker image is created, you can run it using:
  ```sh
  docker run -d --name tutorial-svc -p 8020:8020 --link redis --link etcd tutorial-svc:latest
  ```
  * This will create a docker *container* and run it by executing the *CMD* part of the Dockerfile.
  * To see running containers, use ``` docekr ps ``` command, or ``` docker ps -a ``` to see all containers.
  * **--name tutorial-svc** - Run the docker and name it as *tutorial-svc*.
  * **-p 8020:8020** - Redirect the traffic from port 8020 on your machine to port 8020 in the docker (please refer to the dockerfile to see that we actually **EXPOSE** it, also you should be able to see in index.js that we run the service on that port).
  * **--link redis --link etcd** - Link other dockers to this docker, a prerequisite is to run etcd and redis dockers. This will allow our docker to communicate with redis and etcd. From inside the docker you will have access to 'redis' and 'etcd' hosts.
  * **tutorial-svc:latest** - The docker image to run followed by its version.

## Interacting With Existing Container

* Use ``` docker start <container-name> ``` to start an existing docker.
* Use ``` docker stop <container-name> ``` to stop an existng container.
* Use ``` docker rm <container-name> ``` to remove a container (this will **not** delete the image!).
* Use ``` docker logs <container-name>``` to see logs.
  * ``` --follow ``` - to follow the log.
  * ``` --head <rows> ``` or ``` --tail <rows> ``` to see only *rows* from the head or tail of the log.
* Use ``` docker exec -it <container-name> <command>``` to execute a *command* inside the docker.
  * You can enter to the docker bash command line by using ``` docker exec -it <container-name> bash```


[Click here to see more](https://docs.docker.com/engine/reference/run/)