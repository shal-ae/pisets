FROM node:22

WORKDIR /opt/server

RUN apt-get update && apt-get -y install ghostscript && apt-get -y install graphicsmagick

RUN apt-get -y install libreoffice

COPY . .

RUN npm install

RUN apt-get -y install mc

RUN npm add --global nx --unsafe-perm
# RUN add-apt-repository ppa:nrwl/nx && apt-get update && apt-get install nx

