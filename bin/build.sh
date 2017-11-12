#!/usr/bin/env bash

cd ./packages/badges-server
npm install
cd ..
cd ..

cd ./packages/chat-app
npm install
npm run build
cd ..
cd ..

cd ./packages/marketing-site
npm install
npm run build
cd ..
cd ..
