#!/bin/sh
npm run migrate-dev
wait
npm run schedule-dev
npm run start
