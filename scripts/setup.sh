#!/usr/bin/env bash

echo "setting file permissions"
chmod +x mongodb/bin/mongod
chmod +x scripts/install-npm.sh
chmod +x scripts/npm-dependencies.sh

echo "creating data folder"
mkdir -p data