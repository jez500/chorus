#!/bin/bash

echo "Running compass"
echo "=============================================="
compass clean ./dev/theme
compass compile ./dev/theme -e production

echo "Running Grunt"
echo "=============================================="
grunt

echo "removing old zip"
echo "=============================================="
rm webinterface.chorus.zip

echo "Building zip"
echo "=============================================="
cp -r ./dist ./webinterface.chorus
zip -r -q webinterface.chorus.zip ./webinterface.chorus
rm -rf ./webinterface.chorus

echo "Build complete"
echo "=============================================="

