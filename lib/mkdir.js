// Internal logic inspired by substack's node-mkdirp:
// https://github.com/substack/node-mkdirp/

'use strict';

var isNumber   = require('es5-ext/lib/Number/is-number')
  , isCallable = require('es5-ext/lib/Object/is-callable')
  , deferred   = require('deferred')
  , fs         = require('fs')
  , path       = require('path')

  , stat = fs.stat, original = fs.mkdir
  , dirname = path.dirname, resolve = path.resolve

  , _mkdir, mkdir;

_mkdir = function (path, options, resolve) {
	original(path, options.mode, function (err) {
		var dir;
		if ((err == null) || !options.intermediate) {
			resolve(err);
			return;
		}
		if (err.code === 'ENOENT') {
			dir = dirname(path);
			if (dir === path) {
				resolve(err);
				return;
			}
			_mkdir(dir, options, function (err) {
				if (err) {
					resolve(err);
					return;
				}
				_mkdir(path, options, resolve);
			});
		} else {
			stat(path, function (statErr, stats) {
				resolve((statErr || !stats.isDirectory()) ? err : null);
			});
		}
	});
};
mkdir = function (path, options) {
	var def = deferred();
	_mkdir(path, options, def.resolve);
	return def.promise;
};
mkdir.returnsPromise = true;

module.exports = exports = function (path/*, mode|options, cb*/) {
	var options, cb;

	path = resolve(String(path));
	options = arguments[1];
	cb = arguments[2];

	if ((cb == null) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = isNumber(options) ? { mode: options } : Object(options);
	}

	return mkdir(path, options).cb(cb);
};
exports.returnsPromise = true;
exports.mkdir = mkdir;
