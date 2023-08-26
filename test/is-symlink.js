"use strict";

const { resolve } = require("path")
    , symlink     = require("../symlink")
    , unlink      = require("../unlink");

const rootPath = resolve(__dirname, "./__playground/is-symlink")
    , targetFile = resolve(rootPath, "from")
    , nonSymlink = resolve(rootPath, "non-symlink")
    , symlink1 = resolve(rootPath, "sym1")
    , symlink2 = resolve(rootPath, "sym2");

module.exports = function (t, a, d) {
	symlink(
		"from", symlink1
	)(() => symlink("sym1", symlink2))(() => t(symlink2))(result => {
		a(result, true);
		return t(symlink2, { linkPath: targetFile });
	})(result => {
		a(result, false);
		return t(symlink2, { linkPath: symlink1 });
	})(result => {
		a(result, true);
		return t(symlink2, { linkPath: targetFile, recursive: true });
	})(result => {
		a(result, true);
		return t(targetFile);
	})(result => {
		a(result, false);
		return t(`${ targetFile }/foo`);
	})(result => {
		a(result, null);
		return unlink(symlink1)(unlink(symlink2));
	})(() => t(nonSymlink, { loose: true }))(result => { a(result, null); }).done(d, d);
};
