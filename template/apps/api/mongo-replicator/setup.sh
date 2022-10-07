#!/usr/bin/env bash
set -e

command="rs.initiate({ _id: '$REPLICA_SET_NAME', members: [{ _id: 0, host: '$HOST:$PORT' }]})"

for i in $(seq 1 20); do
  if [[ $i -eq 20 ]]; then
    echo "Replication failed"
    exit 1
  fi

  echo "Replication attempt"

  if [[ $USERNAME ]]; then
    mongo $HOST:$PORT --authenticationDatabase "admin" -u $USERNAME -p $PASSWORD --quiet --eval "$command" && break
  else
    mongo $HOST:$PORT --quiet --eval "$command" && break
  fi

  sleep 2
done

echo "Replication done"

[[ $IMMORTAL ]] && while true; do sleep 1; done

exit 0
