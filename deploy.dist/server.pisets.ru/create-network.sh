#!/bin/bash

docker network rm pisets-network -f

docker network create -o "com.docker.network.bridge.host_binding_ipv4"="185.87.194.206" pisets-network
