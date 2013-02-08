// Copy file
// Credit: Isaac Schlueter
// http://groups.google.com/group/nodejs/msg/ef4de0b516f7d5b8

'use strict';

var isCallable = require('es5-ext/lib/Object/is-callable')
  , deferred   = require('deferred')
  , fs         = require('fs')

  , createReadStream = fs.createReadStream
  , createWriteStream = fs.createWriteStream

  , copy;

copy = function (source, dest, options) {
	var def = deferred(), stream, writeStream;
	try {
		stream = createReadStream(source);
		stream.on('error', def.resolve);
		writeStream = createWriteStream(dest, options);
		writeStream.on('error', def.resolve);
		stream.pipe(writeStream);
		writeStream.on('close', def.resolve);
	} catch (e) {
		def.resolve(e);
	}
	return def.promise;
};
copy.returnsPromise = true;

module.exports = exports = function (source, dest/*, options, cb*/) {
	var options = Object(arguments[2]), cb = arguments[3];
	if ((cb == null) && isCallable(options)) {
		cb = options;
		options = {};
	}

	return copy(String(source), String(dest), options).cb(cb);
};
exports.copy = copy;
exports.returnsPromise = true;
