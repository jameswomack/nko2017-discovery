# Set the base image to alpine Node LTS
FROM npmjs/npm-docker-baseline:8-alpine

# File Author / Maintainer
MAINTAINER Ben Coe

WORKDIR /app/src
COPY ./package.json /app/src/
COPY ./.kicker.toml /app/src/
COPY ./server.js /app/src/
COPY ./public/ /app/src/public/
COPY ./public/js/ /app/src/js/
COPY ./client/ /app/src/client/

RUN npm install

RUN npm uninstall node-gyp -g && apk del python make g++ && rm -rf /var/cache/apk/*
