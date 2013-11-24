#!/usr/bin/env node
var _       = require('underscore');
var md5     = require('MD5');
var scanner = require('./scanner');
var duper   = require('./duper');
var fs      = require('fs');

var startPath = process.argv[2] || './';

scanner.mapImagesByFilename(startPath, function(err, files) {
    var duplicates = duper.duplicatesByName(files);

    console.log("Duplicates by filename:");
    _.keys(duplicates).map(function(v) {
        console.log(v, "(" + duplicates[v].length + " matches)");

        duplicates[v].map(function(filename) {
            fs.readFile(filename, function(err, buf) {
                console.log("    ", filename, "md5=" + md5(buf));
            });

        });
    });
});
