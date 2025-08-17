#!/bin/bash
docker compose down -v
cd ../..
git pull
cd deploy/server.pisets.ru
docker compose up -d --build
