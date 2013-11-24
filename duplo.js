#!/usr/bin/env node
var _    = require('underscore');
var scanner = require('./scanner');

var root = process.argv[2] || './';

function duplicatesByName(filemap) {
    return _.chain(filemap)
        .pairs()
        .filter(function(v) {
            return v[1].length > 1;
        })
        .object()
        .value();
}

function isIdentical(file1, file2) {

}

scanner.mapImagesByFilename(root, function(err, files) {
    var duplicates = duplicatesByName(files);

    console.log("Duplicates by filename:");
    _.keys(duplicates).map(function(v) {
        console.log(v);
    });
});
