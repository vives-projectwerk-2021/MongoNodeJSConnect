# Container image that runs your code
FROM alpine:3.10

RUN apk add --update nodejs npm

# Copies your code file from your action repository to the filesystem path `/` of the container
WORKDIR /app
COPY . .

RUN npm install
RUN npm install mongodb
RUN npm install crypto-js

# Code file to execute when the docker container starts up (`entrypoint.sh`)
CMD ["node", "connect"]