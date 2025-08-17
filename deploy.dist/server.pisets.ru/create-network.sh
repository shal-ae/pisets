#!/bin/bash

docker network rm pisets-network -f

docker network create -o "com.docker.network.bridge.host_binding_ipv4"="37.143.11.215" pisets-network
