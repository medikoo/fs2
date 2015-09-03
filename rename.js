'use strict';

var isCallable = require('es5-ext/object/is-callable')
  , deferred   = require('deferred')
  , path       = require('path')
  , original   = require('fs').rename
  , mkdir      = require('./mkdir')

  , dirname = path.dirname, resolve = path.resolve;

var rename = function (oldPath, newPath) {
	var def = deferred();
	original(oldPath, newPath, function (err) {
		if (err) def.reject(err);
		else def.resolve();
	});
	return def.promise;
};
rename.returnsPromise = true;

module.exports = exports = function (oldPath, newPath/*, options, cb*/) {
	var options = Object(arguments[2]), cb = arguments[3];
	if ((cb == null) && isCallable(options)) {
		cb = options;
		options = {};
	}
	oldPath = resolve(String(oldPath));
	if (options.intermediate) {
		return mkdir(dirname(oldPath), { intermediate: true })(function () {
			return rename(oldPath, resolve(String(newPath)));
		}).cb(cb);
	}

	return rename(oldPath, resolve(String(newPath))).cb(cb);
};
exports.returnsPromise = true;
exports.rename = rename;
