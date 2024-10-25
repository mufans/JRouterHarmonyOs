#!/bin/zsh

hvigorw assembleHar --mode module -p module=libraryPlugin@default -p product=default --daemon

echo "assembleHar build end"

cp ./libraryPlugin/build/default/outputs/default/*.har .