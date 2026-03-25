#!/bin/sh

npm run infra &
sleep 3
npm run turbo-start
