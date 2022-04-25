#!/bin/bash

if [[ -z "$MONGO_HOST" ]] || [[ -z "$MONGO_PORT" ]]  || [[ -z "$MONGO_LOGIN" ]] || [[ -z "$MONGO_PASSWORD" ]] || [[ -z "$REPLICA_NAME" ]]; then
    echo "You must provide MONGO_HOST, MONGO_PORT, MONGO_LOGIN, MONGO_PASSWORD and REPLICA_NAME environment variables"
    exit 2
fi

echo "Initialization $REPLICA_NAME replica set for $MONGO_LOGIN:$MONGO_PASSWORD@$MONGO_HOST:$MONGO_PORT"

DIR="${BASH_SOURCE%/*}"
. "$DIR/mongo-tools.sh"

waitForMongo
status=$(getStatus)

if [[ ${status} -eq 0 ]]
then
	echo "Setting up mongo replication"
	
	initiate
	waitForOkStatus
	
	echo "Replication done"
else
	echo "Mongo is already replicated"
fi
