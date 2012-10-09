'use strict';

var partial    = require('es5-ext/lib/Function/prototype/partial')
  , isCallable = require('es5-ext/lib/Object/is-callable')
  , deferred   = require('deferred')
  , fs         = require('fs')
  , path       = require('path')
  , chmod      = require('./chmod')
  , lstat      = require('./lstat')
  , readdir    = require('./readdir')
  , unlink     = require('./unlink')

  , original = fs.rmdir
  , resolve = path.resolve, sep = path.sep
  , rmdir, rmcontent, empty = {};

rmcontent = function (path, options) {
	return readdir(path)(function self(files, repeated) {
		return deferred.map(files, function (name) {
			var filename = path + sep + name, aborted;
			return lstat(filename)(function (stats) {
				var err;
				if (aborted || options.aborted) return;
				if (stats.isDirectory()) {
					return rmcontent(filename, options)(null, function (err) {
						options.aborted = true;
						throw err;
					});
				} else if (options.force) {
					return unlink(filename)(null, function () {
						if (err.code === 'ENOENT') return;
						aborted = true;
						throw err;
					});
				} else {
					err = new Error('ENOTEMPTY rmdir \'' + path + '\'');
					err.errno = 53;
					err.code = 'ENOTEMPTY';
					err.path = path;
					options.aborted = true;
					throw err;
				}
			}, function (err) {
				if (err.code === 'ENOENT') return;
				options.aborted = true;
				throw err;
			});
		})(null, function (err) {
			if (!options.aborted && !repeated && (err.code === 'EACCES') && chmod) {
				return chmod(path, 146)(partial.call(self, files, true));
			}
			throw err;
		});
	}, function (err) {
		if (err.code === 'ENOENT') return;
		throw err;
	})(function () {
		if (options.aborted) return;
		return rmdir(path, empty)(null, function (err) {
			if (options.aborted) return;
			if (err.code === 'ENOTEMPTY') {
				// Race condition (new files were added to the directory in a meantime)
				return rmcontent(path, options);
			} else if (err.code === 'ENOENT') {
				return;
			}
			throw err;
		});
	}, function (err) {
		if (err.code === 'ENOENT') return;
		throw err;
	});
};

rmdir = function (path, options) {
	var def = deferred();
	original(path, function (err) {
		if (err && (err.code === 'ENOTEMPTY') && options.recursive) {
			def.resolve(rmcontent(path, { force: options.force }));
		}
		def.resolve(err);
	});
	return def.promise;
};
rmdir.returnsPromise = true;

module.exports = exports = function (path/*, options, callback*/) {
	var options, cb;

	path = resolve(String(path));
	options = arguments[1];
	cb = arguments[2];

	if ((cb == null) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = Object(options);
	}

	return rmdir(path, options).cb(cb);
};
exports.returnsPromise = true;
exports.rmdir = rmdir;
