"use strict";

var resolve = require("path").resolve
  , symlink = require("../symlink")
  , unlink  = require("../unlink");

var rootPath = resolve(__dirname, "./__playground/is-symlink")
  , targetFile = resolve(rootPath, "from")
  , nonSymlink = resolve(rootPath, "non-symlink")
  , symlink1 = resolve(rootPath, "sym1")
  , symlink2 = resolve(rootPath, "sym2");

module.exports = function (t, a, d) {
	symlink(targetFile, symlink1)(function () { return symlink(symlink1, symlink2); })(function () {
		return t(symlink2);
	})(function (result) {
		a(result, true);
		return t(symlink2, { linkPath: targetFile });
	})(function (result) {
		a(result, false);
		return t(symlink2, { linkPath: symlink1 });
	})(function (result) {
		a(result, true);
		return t(symlink2, { linkPath: targetFile, recursive: true });
	})(function (result) {
		a(result, true);
		return t(targetFile);
	})(function (result) {
		a(result, false);
		return t(targetFile + "/foo");
	})(function (result) {
		a(result, null);
		return unlink(symlink1)(unlink(symlink2));
	})(function () { return t(nonSymlink, { loose: true }); })(function (result) {
		a(result, null);
	}).done(d, d);
};
