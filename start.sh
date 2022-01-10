#!/bin/bash

echo "Starting application..."
docker compose up mssql postgres rabbitmq redis mongo kong-gateway mailhog -d

echo "Starting services (it will take a couple of minutes)..."
sleep 60 && docker compose up -d
echo "Application is up and running."