#!/bin/bash

if [ ! -f "./generated" ]; then
    node index.js generate
fi

if [ $1 = 'add' ]; then
    node index.js add
elif [ $1 = 'update' ]; then
    node index.js update
elif [ $1 = 'remove' ]; then
    node index.js remove
else  
    key=$(cat generated | peco)
    if [ -n "$key" ]; then
    open $(node index.js get $key)
    fi
fi

