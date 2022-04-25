#!/bin/bash

if [[ -n "$WAIT_FOR_HOST" ]] && [[ -n "$WAIT_FOR_PORT" ]]; then
    until nc -z "$WAIT_FOR_HOST" "$WAIT_FOR_PORT"
    do
        echo "Waiting for ($WAIT_FOR_HOST:$WAIT_FOR_PORT) to start..."
        sleep 0.5
    done

    echo "$WAIT_FOR_HOST:$WAIT_FOR_PORT is up"
fi

dotnet SignalR.dll