#!/bin/bash

for database in "payment_service_db";
do
    PGPASSWORD=$POSTGRES_PASSWORD psql --command="CREATE DATABASE $database" --host=postgres --port=5432 --username=postgres
    PGPASSWORD=$POSTGRES_PASSWORD pg_restore --dbname=$database ./dumps/$database  --host=postgres --port=5432 --username=postgres
    if [ $? -eq 0 ]
    then
        echo "restore $database completed"
        continue
    else
        echo "not ready yet..."
        sleep 1
    fi
done
