#!/usr/bin/env bash
set -e

source ./constants.sh

handle_replication() {
  local authArgs=""
  if [[ $USERNAME ]]; then
    authArgs="--authenticationDatabase admin -u $USERNAME -p $PASSWORD"
  fi

  mongosh "$HOST:$PORT" $authArgs --quiet --eval "$1"
}

command="rs.initiate({ _id: '$REPLICA_SET_NAME', members: [{ _id: 0, host: '$HOST:$PORT' }]})"
checkCommand="rs.status()"

for i in $(seq 1 20); do
  if [[ $i -eq 20 ]]; then
    echo "Replication failed"
    exit 1
  fi

  echo "Replication attempt ($i)"

  # Check if the replica set is already initialized
  if handle_replication "$checkCommand" > /dev/null; then
    echo "Replica set already initialized"
    echo "$REPLICATION_SUCCESS_MESSAGE"
    exit 0
  fi

  # Try to initiate the replica set
  if handle_replication "$command" > /dev/null; then
    break
  fi

  sleep 2
done

echo "Replication done"
echo "$REPLICATION_SUCCESS_MESSAGE"

[[ $IMMORTAL ]] && while true; do sleep 1; done

exit 0
