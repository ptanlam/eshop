#!/bin/bash

echo "Bootstrapping application..."
docker compose up mssql postgres rabbitmq redis mongo kong-gateway mailhog -d

echo "It will take a couple of minutes..."
sleep 30

echo "Be patient!"
sleep 20

echo "Almost there"
sleep 10

echo "Starting services../"
docker compose up -d
echo "Complete bootstrapping application"