// fs.writeFile that's safe for simultaneous calls for same file.
// In such event write that is ongoing is exited and new one is initialized

'use strict';

var isCallable = require('es5-ext/lib/Object/is-callable')
  , deferred   = require('deferred')
  , fs         = require('fs')
  , resolve    = require('path').resolve

  , next, writeAll, cache = {}, _writeFile, writeFile;

next = function (path, err) {
	var data = cache[path];
	if (err) {
		delete cache[path];
		data.def.resolve(err);
		return;
	}
	if (data.data) {
		data = data.data;
		delete cache[path].data;
		_writeFile(path, data.data, data.encoding);
	} else {
		delete cache[path];
		data.def.resolve();
	}
};

writeAll = function (path, fd, buffer, offset, length) {
	fs.write(fd, buffer, offset, length, offset, function (writeErr, written) {
		if (writeErr) {
			fs.close(fd, function () {
				next(path, writeErr);
			});
		} else {
			if ((written === length) || cache[path].data) {
				fs.close(fd, function (err) {
					next(path, err);
				});
			} else {
				writeAll(path, fd, buffer, offset + written, length - written);
			}
		}
	});
};

_writeFile = function (path, data, encoding) {
	if (!encoding) {
		encoding = 'utf8';
	}
	fs.open(path, 'w', 438, function (openErr, fd) {
		if (openErr) {
			next(path, openErr);
		} else if (!cache[path].data) {
			var buffer = Buffer.isBuffer(data) ? data : new Buffer(String(data),
				encoding);
			writeAll(path, fd, buffer, 0, buffer.length);
		} else {
			fs.close(fd, function (err) {
				next(path, err);
			});
		}
	});
};

writeFile = function (path, data, encoding) {
	var def;
	if (cache[path]) {
		cache[path].data = { data: data, encoding: encoding };
		def = cache[path].def;
	} else {
		def = deferred();
		cache[path] = { def: def };
		_writeFile(path, data, encoding, def.resolve);
	}

	return def.promise;
};
writeFile.returnsPromise = true;

module.exports = exports = function (path, data) {
	var encoding, cb;

	path = resolve(String(path));
	encoding = arguments[2];
	cb = arguments[3];
	if ((cb == null) && isCallable(encoding)) {
		cb = encoding;
		encoding = null;
	}

	return writeFile(path, data, encoding).cb(cb);
};
exports.returnsPromise = true;
exports.writeFile = writeFile;
