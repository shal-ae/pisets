FROM node:22

WORKDIR /opt/server

RUN apt-get update && apt-get -y install mc && apt-get -y install ghostscript && apt-get -y install graphicsmagick

RUN apt-get -y install libreoffice

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx nx run front:build:production
RUN npx nx run back:build:production --no-daemon
