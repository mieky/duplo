var _       = require('underscore');
var md5     = require('MD5');
var fs      = require('fs');
var scanner = require('./scanner');

/**
    Filter a map, containing only those entries the key of which has more than one value.

    E.g.
    { a: [1,2,3], b: [4], c: [5,6] }
    ->
    { a: [1,2,3], c:[5,6] }
*/
function duplicates(fileMap) {
    return _.chain(fileMap)
        .pairs()
        .filter(function(v) {
            return v[1].length > 1;
        })
        .object()
        .value();
}

/**
    Return a map of files grouped by their MD5 sums.
    Also logs process info while scanning.

    E.g.
    { 'img2.jpg': [ './/test/import-3/img2.jpg', './/test/import-1/img2.jpg' ],
      'img1.jpg': [ './/test/import-2/img1.jpg', './/test/import-1/img1.jpg' ] }
    ->
    { b1f8546c0bb13e1bda64c7795d7c7d5b:
       [ { filename: './/test/import-3/img2.jpg', md5: 'b1f8546c0bb13e1bda64c7795d7c7d5b' } ],
      f467567c76296dd0c204d9bccafc7bc0:
       [ { filename: './/test/import-1/img2.jpg', md5: 'f467567c76296dd0c204d9bccafc7bc0' } ],
      '8f26b488cc2092d3c365e6627d22c19e':
       [ { filename: './/test/import-2/img1.jpg', md5: '8f26b488cc2092d3c365e6627d22c19e' },
         { filename: './/test/import-1/img1.jpg', md5: '8f26b488cc2092d3c365e6627d22c19e' } ] }
*/
function groupByMD5(fileMap) {
    return _.chain(fileMap)
        .keys()
        .map(function(filename) {
            console.log(filename, "(" + fileMap[filename].length + " matches)");

            return fileMap[filename].map(function(filename) {
                var buf = null;
                var md5sum = null;

                try {
                    buf = fs.readFileSync(filename);
                    md5sum = md5(buf);
                } catch (e) {
                    console.error("Error calculating md5 sum:", e);
                }

                console.log("  ", filename, "md5=" + md5sum)
                return {
                    filename: filename,
                    md5: md5sum
                };
            });
        })
        .flatten()
        .groupBy('md5')
        .value();
}

/**
    Search path for duplicate filenames.
*/
function duplicatesByName(startPath, callback) {
    scanner.imagesByFilename(startPath, function(err, fileMap) {
        var duplicateFilenames = duplicates(fileMap);
        callback(null, duplicateFilenames);
    });
}

/**
    Search path for duplicate filenames, and further duplicate MD5 sums.
*/
function duplicatesByNameAndMD5(startPath, callback) {
    duplicatesByName(startPath, function(err, fileMap) {
        var duplicateFilenamesByMD5 = duplicates(groupByMD5(fileMap));
        callback(null, duplicateFilenamesByMD5);
    });
}

module.exports = {
    duplicates: duplicates,
    duplicatesByName: duplicatesByName,
    duplicatesByNameAndMD5: duplicatesByNameAndMD5,
    groupByMD5: groupByMD5
}