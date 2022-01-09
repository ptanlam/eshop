#!/bin/bash

docker compose up mssql postgres -d

echo "Initializing mssql databases..."
docker exec -it $(docker ps -f name="eshop-postgres*" -q --no-trunc) ./import-databases.sh

echo "Initializing postgres databases..."
docker exec $(docker ps -f name="eshop-mssql*" -q --no-trunc) ./import-databases.sh

docker compose down