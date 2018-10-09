#!/bin/bash

# How to upgrade uikit
# Checkout the new version
git clone https://github.com/uikit/uikit uikit-new

# Move theme items to the new folder
cp -R uikit/custom uikit-new
cp -R uikit/themes.json uikit-new

# Rename old and uikit folder
mkdir bak

d=$(date +%Y-%m-%d-%H%-M%-S);

mkdir "./bak"
mkdir "./bak/uikit-$d"

mv uikit-new uikit

# Go to new directory
cd uikit

# Install node modules
yarn

# Build from source
yarn compile-less

# yarn watch
