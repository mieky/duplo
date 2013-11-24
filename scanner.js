var walk = require('walk');
var path = require('path');
var _    = require('underscore');

function isJpeg(filename) {
    return _.contains(['.jpg', '.jpeg'], path.extname(filename).toLowerCase());
}

function mapByFilename(rootPath, filter, callback) {
    console.log("Scanning " + rootPath + "...");

    var files = {};
    var walker = walk.walk(rootPath, { followLinks: false });

    walker.on('directory', function(root, stat, next) {
        console.log("  ", stat.name + path.sep);
        next();
    });

    walker.on('file', function(rootPath, stat, next) {
        var filename = stat.name;
        if (!filter(filename)) {
            return next();
        }

        var filePath = rootPath + '/' + stat.name;
        if (files[filename]) {
            files[filename].push(filePath);
        } else {
            files[filename] = [filePath];
        }
        next();
    });

    walker.on('end', function() {
        console.log("Scanning done.");
        callback(null, files);
    });
};

module.exports = {
    imagesByFilename: function(root, callback) {
        return mapByFilename(root, isJpeg, callback);
    }
}