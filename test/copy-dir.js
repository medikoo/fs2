"use strict";

var deferred = require("deferred")
  , path     = require("path")
  , readdir  = require("../readdir")
  , readlink = require("../readlink")
  , symlink  = require("../symlink")
  , rm       = require("../rm");

var relative = path.relative
  , resolve = path.resolve
  , pg = path.resolve(__dirname, "./__playground/copy-dir");

module.exports = function (t, a, d) {
	var src = resolve(pg, "some-dir")
	  , srcFile1 = resolve(src, "sample1")
	  , srcSymlink1 = resolve(src, "symlink1")
	  , srcSymlink2 = resolve(src, "symlink2")
	  , dst = resolve(pg, "dir-copy");
	symlink(srcFile1, srcSymlink1)(function () { return symlink(__dirname, srcSymlink2); })(
		function () { return t(src, dst); }
	)(function () {
		return deferred(readdir(src, { depth: Infinity }), readdir(dst, { depth: Infinity }));
	})
		.spread(function (srcFiles, dstFiles) {
			a.deep(srcFiles, dstFiles);
			return readlink(resolve(dst, "symlink1"));
		})(function (symLinkPath) {
			a(symLinkPath, relative(dst, resolve(dst, "sample1")));
			return readlink(resolve(dst, "symlink2"));
		})(function (symLinkPath) {
			a(symLinkPath, relative(dst, __dirname));
			return rm(dst, { recursive: true, force: true })(rm(srcSymlink1))(rm(srcSymlink2));
		})
		.done(d, d);
};
