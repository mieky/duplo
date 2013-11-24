var _       = require('underscore');
var md5     = require('MD5');
var fs      = require('fs');
var scanner = require('./scanner');

function duplicates(fileMap) {
    return _.chain(fileMap)
        .pairs()
        .filter(function(v) {
            return v[1].length > 1;
        })
        .object()
        .value();
}

function groupByMD5(fileMap) {
    return _.chain(fileMap)
        .keys()
        .map(function(filename) {
            console.log(filename, "(" + fileMap[filename].length + " matches)");

            return fileMap[filename].map(function(filename) {
                var buf = fs.readFileSync(filename);
                var md5sum = md5(buf);

                console.log("    ", filename, "md5=" + md5sum)
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

function duplicatesByNameAndMD5(startPath, callback) {
    scanner.imagesByFilename(startPath, function(err, fileMap) {
        var duplicateFilenames = duplicates(fileMap);
        var duplicateFilenamesByMD5 = duplicates(groupByMD5(duplicateFilenames));

        callback(null, duplicateFilenamesByMD5);
    });
}

module.exports = {
    duplicates: duplicates,
    duplicatesByNameAndMD5: duplicatesByNameAndMD5
}