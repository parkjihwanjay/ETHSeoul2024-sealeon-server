#!/bin/bash
# Define the container name based on the ENV_TYPE environment variable
POSTGRES_CONTAINER_NAME="sealeon-server-db"

# Check and run or start PostgreSQL container
if [ "$(docker ps -q -f name=${POSTGRES_CONTAINER_NAME})" ]; then
    echo 'PostgreSQL CONTAINER IS RUNNING'
elif [ "$(docker ps -aq -f status=exited -f name=${POSTGRES_CONTAINER_NAME})" ]; then
    echo 'PostgreSQL CONTAINER EXISTS BUT STOPPED. STARTING IT...'
    docker start ${POSTGRES_CONTAINER_NAME}
else 
    echo 'CREATING NEW PostgreSQL CONTAINER'
    docker run --name ${POSTGRES_CONTAINER_NAME} -e POSTGRES_PASSWORD=sealeon-server-db -e POSTGRES_USER=sealeon-server-db -e POSTGRES_DB=sealeon-server-db -p 5432:5432 -d postgres:16.0-bullseye
fi