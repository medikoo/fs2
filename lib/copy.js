// Copy file
// Credit: Isaac Schlueter
// http://groups.google.com/group/nodejs/msg/ef4de0b516f7d5b8

'use strict';

var deferred = require('deferred')
  , fs       = require('fs')

  , stat = fs.stat, createReadStream = fs.createReadStream
  , createWriteStream = fs.createWriteStream

  , copy;

copy = function (source, dest) {
	var def = deferred();
	stat(source, function (err, stats) {
		var stream;
		if (err) {
			def.resolve(err);
			return;
		}
		try {
			stream = createReadStream(source);
			stream.on('error', def.resolve);
			stream.pipe(createWriteStream(dest, { mode: stats.mode }));
			stream.on('end', def.resolve);
		} catch (e) {
			def.resolve(e);
		}
	});
	return def.promise;
};
copy.returnsPromise = true;

module.exports = exports = function (source, dest/*, cb*/) {
	return copy(String(source), String(dest)).cb(arguments[2]);
};
exports.copy = copy;
exports.returnsPromise = true;
