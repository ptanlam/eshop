#!/bin/bash

sleep 20

# for filename in ./dumps;
# do
PSPASSWORD=$POSTGRES_PASSWORD psql --command="CREATE DATABASE payment_service_db" --host=host.docker.internal --port=5432 --username=postgres
PSPASSWORD=$POSTGRES_PASSWORD pg_restore --dbname=payment_service_db ./dumps/payment_service_db  --host=host.docker.internal --port=5432 --username=postgres
#     if [ $? -eq 0 ]
#     then
#         echo "$filename completed"
#         continue
#     else
#         echo "not ready yet..."
#         sleep 1
#     fi
# done
