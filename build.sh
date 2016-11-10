#!/bin/bash

if [ ! -x node_modules ]
then
  echo "Installing Dependencies"
  npm install mongoose morgan passport bcrypt-nodejs passport-http express body-parser --save
fi

