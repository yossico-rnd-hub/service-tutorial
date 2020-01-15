# Usefull Commands

* ```sh 
  docker build -t tutorial-svc . 
   ```
   * This builds the docker according to the docker file.
   * The build will result in a *docker image*, please run ``` docker images ``` and see that the docker image is created.
   * This will tag it with the name *tutorial-svc* and version *latest*.
   * To be able to run this command, you have to set the current directory to the root of the service (where your dockerfile is located).
* Once docker is created, you can run it using:
  ```sh
  docker run -d --name tutorial-svc -p 8020:8020 --link redis --link etcd tutorial-svc:latest
  ```
  * **--name tutorial-svc** - Run the docker and name it as *tutorial-svc*.
  * **-p 8020:8020** - Redirect the traffic from port 8020 on your machine to port 8020 in the docker (please refer to the dockerfile to see that we actually **EXPOSE** it, also you should be able to see in index.js that we run the service on that port).
  * **--link redis --link etcd** - Link other dockers to this docker, a prerequisite is to run etcd and redis dockers. This will allow our docker to communicate with redis and etcd. From inside the docker you will have access to 'redis' and 'etcd' hosts.
  * **tutorial-svc:latest** - The docker image to run followed by its version.