# Set the base image to alpine Node LTS
FROM npmjs/npm-docker-baseline:8-alpine

# File Author / Maintainer
MAINTAINER Ben Coe

WORKDIR /app/src
COPY ./package.json /app/src/
COPY ./.kicker.toml /app/src/
COPY ./index.js /app/src/
COPY ./images/ /app/src/images/

RUN npm install

RUN npm uninstall node-gyp -g && apk del python make g++ && rm -rf /var/cache/apk/*
