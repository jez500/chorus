#!/bin/bash

echo "Running compass"
echo "=============================================="
compass clean ./theme
compass compile ./theme -e production

echo "Running Grunt"
echo "=============================================="
grunt

echo "removing old zip"
echo "=============================================="
rm webinterface.chorus.zip

echo "Building zip"
echo "=============================================="
cp -r ./dist ./webinterface.chorus
zip -r webinterface.chorus.zip ./webinterface.chorus
rm -rf ./webinterface.chorus

echo "Build complete"
echo "=============================================="

