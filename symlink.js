"use strict";

const isCallable = require("es5-ext/object/is-callable")
    , isValue    = require("es5-ext/object/is-value")
    , isString   = require("es5-ext/string/is-string")
    , deferred   = require("deferred")
    , path       = require("path")
    , original   = require("fs").symlink
    , mkdir      = require("./mkdir");

const symlink = function (src, dest, options) {
	const def = deferred();
	original(src, dest, options.type, err => {
		if (err) {
			def.reject(err);
			return;
		}
		def.resolve();
	});
	return def.promise;
};
symlink.returnsPromise = true;

module.exports = exports = function (src, dest, options = {}, cb = null) {
	src = String(src);
	dest = path.resolve(String(dest));
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = isString(options) ? { type: options } : Object(options);
	}

	if (options.intermediate) {
		return mkdir(path.dirname(dest), { intermediate: true })(() =>
			symlink(src, dest, options)
		).cb(cb);
	}

	return symlink(src, dest, options).cb(cb);
};
exports.returnsPromise = true;
exports.symlink = symlink;
