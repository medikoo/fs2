"use strict";

const isCallable  = require("es5-ext/object/is-callable")
    , isValue     = require("es5-ext/object/is-value")
    , deferred    = require("deferred")
    , path        = require("path")
    , original    = require("fs").rename
    , mkdir       = require("./mkdir")
    , copy        = require("./copy")
    , unlink      = require("./unlink")
    , { dirname } = path
    , { resolve } = path;

const crossDeviceRename = function (oldPath, newPath) {
	return copy(oldPath, newPath)(() => unlink(oldPath));
};

const rename = function (oldPath, newPath) {
	const def = deferred();
	original(oldPath, newPath, err => {
		if (err) {
			if (err.code === "EXDEV") {
				def.resolve(crossDeviceRename(oldPath, newPath));
				return;
			}
			def.reject(err);
		} else {
			def.resolve();
		}
	});
	return def.promise;
};
rename.returnsPromise = true;

module.exports = exports = function (oldPath, newPath, options = {}, cb = null) {
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	}
	oldPath = resolve(String(oldPath));
	newPath = resolve(String(newPath));
	if (options.intermediate) {
		return mkdir(dirname(newPath), { intermediate: true })(() => rename(oldPath, newPath)).cb(
			cb
		);
	}

	return rename(oldPath, resolve(String(newPath))).cb(cb);
};
exports.returnsPromise = true;
exports.rename = rename;
