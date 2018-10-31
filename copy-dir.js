"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , startsWith = require("es5-ext/string/#/starts-with")
  , deferred   = require("deferred")
  , path       = require("path")
  , lstat      = require("./lstat")
  , readdir    = require("./readdir")
  , readlink   = require("./readlink")
  , symlink    = require("./symlink")
  , copyFile   = require("./copy").copy;

var dirname = path.dirname, resolve = path.resolve, sep = path.sep;

var copyDir = function (source, dest, options, sourceTop, destTop) {
	return readdir(source, {
		type: { directory: true, file: true, symbolicLink: true },
		depth: Infinity
	})(
		function (files) {
			return deferred.map(files, function (relativePath) {
				var filename = resolve(source, relativePath);
				return lstat(filename)(function (stats) {
					if (stats.isDirectory()) {
						return copyDir(
							filename, resolve(dest, relativePath), options, sourceTop, destTop
						);
					}
					if (stats.isFile()) {
						return copyFile(filename, resolve(dest, relativePath), {
							intermediate: true
						});
					}
					if (!stats.isSymbolicLink()) return null;
					return readlink(filename)(function (linkPath) {
						linkPath = resolve(source, linkPath);
						var linkDirname = dirname(linkPath);
						if (
							linkDirname === sourceTop ||
							startsWith.call(linkDirname, sourceTop + sep)
						) {
							linkPath = resolve(destTop, linkPath.slice(sourceTop.length + 1));
						}
						return symlink(linkPath, resolve(dest, relativePath), {
							intermediate: true
						});
					});
				});
			});
		},
		function (error) {
			if (options.loose && error.code === "ENOENT") return false;
			throw error;
		}
	)(true);
};
copyDir.returnsPromise = true;

module.exports = exports = function (source, dest/*, options, cb*/) {
	var options = Object(arguments[2]), cb = arguments[3];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	}

	source = resolve(String(source));
	dest = resolve(String(dest));
	return copyDir(source, dest, options, source, dest).cb(cb);
};
exports.copyDir = copyDir;
exports.returnsPromise = true;
