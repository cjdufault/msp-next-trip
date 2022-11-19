#!/bin/bash
# Place this script on the server that you're deploying to.
# Assumes that nginx is installed and configured to serve the contents of /var/www/html.

cd /tmp
git clone https://github.com/cjdufault/msp-next-trip.git
cd msp-next-trip

npm install
npm run build

sudo rm -rf /var/www/html/*
sudo mv build/* /var/www/html
sudo systemctl restart nginx

rm -rf /tmp/msp-next-trip