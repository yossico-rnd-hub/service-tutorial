# Define base image - this image will be built first.
FROM node:12.2.0-alpine

# Install required packages for the linux env.
# apk update - update the available packages db.
# apk add - Installs a linux package.
# sudo - a package that allows running commands as a privileged user.
# bash - a shell to be able to execute commands directly in the docker.
# nano - a lightweight and simple text editor.
# curl - allows us to execute http requets.
RUN apk update && apk add sudo bash nano curl

# Define a variable called dirpath. This is the root of the service.
ENV DIRPATH /opt/service-tutorial/

# Create the working directory of the service.
WORKDIR ${DIRPATH}

# CONFD

# Copy the executable to the path: /opt/confd/bin/confd.
ADD https://github.com/kelseyhightower/confd/releases/download/v0.15.0/confd-0.15.0-linux-amd64 /opt/confd/bin/confd
# Add executable permissions to the confd executable (if we don't do that, we would not be able to run confd).
RUN chmod +x /opt/confd/bin/confd
# Define the confd in the path. This allows us to run confd everywhere. (if we don't do that, we will have to run /opt/confd/bin instead).
ENV PATH="$PATH:/opt/confd/bin"

# Define the environment as production.
ENV NODE_ENV=production

# Copy the confd templates to the docker's file system.
COPY ./confd/*.toml /etc/confd/conf.d/
COPY ./confd/*.tmpl /etc/confd/templates/

# Copy the service intirely.
COPY . ${DIRPATH}
# Copy the run script and set it to be executable.
RUN chmod +x ${DIRPATH}/run.sh

# npm install inside the docker.
RUN npm install

# Expose the port 8020, we will run our service on this port.
EXPOSE 8020

# Define a command to be run when we execute docker run command.
CMD [ "./run.sh" ]
