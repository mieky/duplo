var _       = require('underscore');
var md5     = require('MD5');
var fs      = require('fs');

function duplicatesByName(filemap) {
    return _.chain(filemap)
        .pairs()
        .filter(function(v) {
            return v[1].length > 1;
        })
        .object()
        .value();
}

function isMd5Match(file1, file2, callback) {
    fs.readFile(file1, function(err1, data1) {
        if (err1) {
            throw err1;
        }

        fs.readFile(file2, function(err2, data2) {
            if (err2) {
                throw err2;
            }
            callback(null, md5(data1) === md5(data2));
        })
    });
}

module.exports = {
    duplicatesByName: duplicatesByName,
    isMd5Match: isMd5Match
}