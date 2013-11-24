var walk = require('walk');
var path = require('path');
var _    = require('underscore');

function isJpeg(filename) {
    return _.contains(['.jpg', '.jpeg'], path.extname(filename).toLowerCase());
}

function mapByFilename(path, filter, callback) {
    console.log("Scanning " + path);

    var files = {};
    var walker = walk.walk(path, { followLinks: false });

    walker.on('file', function(path, stat, next) {
        var filename = stat.name;
        if (!filter(filename)) {
            return next();
        }

        var filePath = path + '/' + stat.name;
        if (files[filename]) {
            files[filename].push(filePath);
        } else {
            files[filename] = [filePath];
        }
        next();
    });

    walker.on('end', function() {
        callback(null, files);
    });
};

module.exports = {
    imagesByFilename: function(root, callback) {
        return mapByFilename(root, isJpeg, callback);
    }
}