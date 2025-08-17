#!/bin/bash

docker compose down

docker compose down -v

cd ../..

git pull

cd deploy/server.pisets.ru


docker compose build

docker compose up -d --build


