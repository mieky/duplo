#!/usr/bin/env node
var duper   = require('./duper');

var startPath = process.argv[2] || './';

duper.duplicatesByNameAndMD5(startPath, function(err, dupeMap) {
    console.log(dupeMap);
});
