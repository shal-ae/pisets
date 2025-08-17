FROM node:20

WORKDIR /opt/server

RUN apt-get update && apt-get -y install mc && apt-get -y install ghostscript && apt-get -y install graphicsmagick

RUN apt-get -y install libreoffice

COPY package*.json ./
RUN npm ci

COPY . .

ENV NX_DAEMON=false

RUN npx nx run back:build:production

RUN npx nx run front:build:development

