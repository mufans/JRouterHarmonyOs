#!/bin/zsh

npm run package 

find ~/.hvigor -name "*mufans*.tgz" -exec rm -rf {} \;
