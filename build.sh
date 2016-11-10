#!/bin/bash

if [ ! -x node_modules ]
then
  echo "Installing Dependencies"
  npm link express body-parser
  npm install mongoose morgan passport bcrypt-nodejs passport-http --save
fi

mocha test/unit/*.js
#mocha-casperjs test/end2end/*.js
