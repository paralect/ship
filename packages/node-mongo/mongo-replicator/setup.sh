#!/usr/bin/env bash
set -e

command="rs.initiate({ _id: '$REPLICA_SET_NAME', members: [{ _id: 0, host: '$HOST:$PORT' }]})"
checkCommand="rs.status()"

for i in $(seq 1 20); do
  if [[ $i -eq 20 ]]; then
    echo "Replication failed"
    exit 1
  fi

  echo "Replication attempt ($i)"

  # Check if the replica set is already initialized
  if [[ $USERNAME ]]; then
    mongosh "$HOST":"$PORT" --authenticationDatabase "admin" -u "$USERNAME" -p "$PASSWORD" --quiet --eval "$checkCommand" > /dev/null && echo "Replica set already initialized" && exit 0
  else
    mongosh "$HOST":"$PORT" --quiet --eval "$checkCommand" && echo "Replica set already initialized" && exit 0
  fi

  # Try to initiate the replica set
  if [[ $USERNAME ]]; then
    mongosh "$HOST":"$PORT" --authenticationDatabase "admin" -u "$USERNAME" -p "$PASSWORD" --quiet --eval "$command" > /dev/null && break
  else
    mongosh "$HOST":"$PORT" --quiet --eval "$command" && break
  fi

  sleep 2
done

echo "Replication done"

[[ $IMMORTAL ]] && while true; do sleep 1; done

exit 0
