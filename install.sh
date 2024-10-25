#!/bin/zsh
/Applications/DevEco-Studio.app/Contents/tools/ohpm/bin/ohpm install --all --registry https://repo.harmonyos.com/ohpm/  --strict_ssl true
/Applications/DevEco-Studio.app/Contents/tools/node/bin/node /Applications/DevEco-Studio.app/Contents/tools/hvigor/bin/hvigorw.js --sync -p product=default -p buildMode=debug --analyze=normal --parallel --incremental --no-daemon
