#!/bin/bash

tags=($(git tag))
echo "${#tags[@]}"
echo $tags

if [$tags -eq ''];
then
    echo empty
else
    echo not Empty
fi
