#!/usr/bin/env bash

echo "adding dependencies..."

echo "adding bower global install"
npm install -g bower
echo "adding pm2 global install"
npm install -g pm2
echo "adding gulp global install"
npm install -g gulp

echo "dependencies added"