#!/bin/bash

sleep 20

for filename in ./scripts/*.sql;
do
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Admin@123 -d master -i $filename
    if [ $? -eq 0 ]
    then
        echo "$filename completed"
        continue
    else
        echo "not ready yet..."
        sleep 1
    fi
done