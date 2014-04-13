#!/bin/bash

if [ "$1" == "" ]; then
  echo "Missing version number. I did nothing"
  exit 1
fi

echo "Running Grunt"
echo "=============================================="
grunt build

echo "Running compass"
echo "=============================================="
compass clean ./src/theme
compass compile ./src/theme -e production

echo "removing old zip"
echo "=============================================="
rm webinterface.chorus*.zip

echo "Building zip"
echo "=============================================="
cp -r ./dist ./webinterface.chorus
zip -r -q webinterface.chorus.$1.zip ./webinterface.chorus
rm -rf ./webinterface.chorus

echo "Build complete"
echo "=============================================="

