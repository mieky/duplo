#!/usr/bin/env node
var walk = require('walk');
var fs = require('fs');
var _ = require('underscore');

console.log("duplo");

var files = {};

var walker = walk.walk('./', { followLinks: false });

walker.on('file', function(root, stat, next) {
    var filename = stat.name;
    var path = root + '/' + stat.name;

    if (files[filename]) {
        files[filename].push(path);
    } else {
        files[filename] = [path];
    }

    next();
});

walker.on('end', function() {
    console.log(files);
});
