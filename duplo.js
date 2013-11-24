#!/usr/bin/env node
var _       = require('underscore');
var path    = require('path');
var duper   = require('./duper');

var startPath = process.argv[2] || './';

/*
    { '8f26b488cc2092d3c365e6627d22c19e':
       [ { filename: './/test/import-2/img1.jpg',
           md5: '8f26b488cc2092d3c365e6627d22c19e' },
         { filename: './/test/import-1/img1.jpg',
           md5: '8f26b488cc2092d3c365e6627d22c19e' } ] }
    ->
    [ './/test/import-1/img1.jpg' ]
*/
function getSafeToDeleteList(dupesByNameAndMD5) {
    return _.chain(dupesByNameAndMD5)
        .pairs()
        .map(function(v) {
            return _.pluck(_.rest(v[1]), 'filename');
        })
        .flatten()
        .value();
}

/*
    { 'img2.jpg': [ './/test/import-3/img2.jpg', './/test/import-1/img2.jpg' ],
      'img1.jpg': [ './/test/import-2/img1.jpg', './/test/import-1/img1.jpg' ] }
    ->
    [ './/test/import-1/img2.jpg' ]
*/
function getRenameList(dupesByName, safeToDelete) {
    return _.chain(dupesByName)
        .pairs()
        // Exclude duplicates to be deleted
        .map(function(v) {
            return [v[0], _.difference(v[1], safeToDelete)];
        })
        // Exclude items that are de-duped by deletion
        .filter(function(v) {
            return v[1].length > 1;
        })
        // One of the items may retain its name
        .map(function(v) {
            return _.rest(v[1]);
        })
        .flatten()
        .value();
}

function suggestNewFilename(filename) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    var ext = path.extname(filename);
    var varPart = "-" + s4();
    return path.dirname(filename) + path.sep + path.basename(filename, ext) + varPart + ext;
}

duper.duplicatesByName(startPath, function(err, dupesByName) {
    var dupesByNameAndMD5 = duper.duplicates(duper.groupByMD5(dupesByName));

    console.log("\nThese files have copies and should be safe to delete:");
    var safeToDelete = getSafeToDeleteList(dupesByNameAndMD5);
    safeToDelete.map(function(filename) {
        console.log(filename);
    });

    console.log("\nThese files should be renamed:");
    var toRename = getRenameList(dupesByName, safeToDelete);
    toRename.map(function(filename) {
        console.log(filename, "->", suggestNewFilename(filename));
    });

});
