#!/bin/bash

# Script to fix permission issues with node_modules directory
echo "Checking ownership of node_modules directory..."
ls -la | grep node_modules

echo "Removing node_modules directory owned by root..."
sudo rm -rf node_modules

echo "Reinstalling packages as current user..."
yarn install

echo "Verifying new ownership of node_modules directory..."
ls -la | grep node_modules

echo "Installation complete. If you encounter any issues, please refer to the guidelines in .junie/guidelines.md"