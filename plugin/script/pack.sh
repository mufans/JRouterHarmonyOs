#!/bin/zsh

npm run package 

find ~/.hvigor -name "*mufans*.tgz" -exec rm -rf {} \;

# cd ~/androidProj/HarmonyOs

# /Applications/DevEco-Studio.app/Contents/tools/node/bin/node /Applications/DevEco-Studio.app/Contents/tools/hvigor/bin/hvigorw.js --sync -p product=default -p buildMode=debug --analyze=normal --parallel --incremental --no-daemon
