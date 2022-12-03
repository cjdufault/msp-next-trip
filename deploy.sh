#!/bin/bash
# Place this script on the server that you're deploying to.
# Assumes that nginx is installed and configured to serve the contents of /var/www/html.

COLOR_BLUE="\e[34m"
END_COLOR="\e[0m"

REACT_APP_REPO_NAME="msp-next-trip"
REACT_APP_REPO_URL="https://github.com/cjdufault/${REACT_APP_REPO_NAME}.git"
GTFS_PARSER_VERSION="v0.0.5"
GTFS_PARSER_PACKAGE_URL="https://github.com/cjdufault/routedataparse/releases/download/${GTFS_PARSER_VERSION}/routedataparse"
METRO_TRANSIT_GTFS_FEED_URL="https://svc.metrotransit.org/mtgtfs/gtfs.zip"

echo -e "${COLOR_BLUE}Cloning...${END_COLOR}"
cd /tmp
git clone $REACT_APP_REPO_URL
cd $REACT_APP_REPO_NAME

echo -e "${COLOR_BLUE}Installing Dependencies...${END_COLOR}"
npm install
echo -e "${COLOR_BLUE}Building...${END_COLOR}"
npm run build

echo -e "${COLOR_BLUE}Pulling and installing GTFS parser package...${END_COLOR}"
wget $GTFS_PARSER_PACKAGE_URL
chmod +x routedataparse
sudo mv routedataparse /usr/local/bin/

echo -e "${COLOR_BLUE}Downloading and parsing route data...${END_COLOR}"
routedataparse $METRO_TRANSIT_GTFS_FEED_URL build/shapes

echo -e "${COLOR_BLUE}Deploying to webroot...${END_COLOR}"
sudo rm -rf /var/www/html/*
sudo mv build/* /var/www/html
sudo systemctl restart nginx

echo -e "${COLOR_BLUE}Cleaning up...${END_COLOR}"
rm -rf /tmp/msp-next-trip
