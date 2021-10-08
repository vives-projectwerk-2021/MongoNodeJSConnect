# Container image that runs your code
FROM node:lts-alpine as build-stage

RUN apk add --update nodejs npm

# Copies your code file from your action repository to the filesystem path `/` of the container
WORKDIR /app
COPY . .

RUN npm install mongodb
RUN npm install crypto-js

EXPOSE 8080 

# Code file to execute when the docker container starts up (`entrypoint.sh`)
CMD ["node", "connect"]