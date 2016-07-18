#!/usr/bin/env bash

echo "setting up server..."
chmod +x scripts/setup.sh
./scripts/setup.sh
./scripts/npm-dependencies.sh

echo "setup finished successfully"
echo "start the server:"
echo "    $ gulp"
echo "stop the server:"
echo "    $ gulp stop"
echo "restart the server:"
echo "    $ gulp restart"