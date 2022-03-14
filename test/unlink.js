"use strict";

const lstat     = require("../lstat")
    , writeFile = require("../write-file")
    , testFile  = require("path").resolve(__dirname, "__playground/unlink");

module.exports = function (t, a, d) {
	return writeFile(
		testFile, "foo"
	)(() =>
		lstat(testFile)(() =>
			t(testFile)(() =>
				lstat(testFile)(a.never, err => {
					a(err.code, "ENOENT");
					return t(`${ testFile }bla`, { loose: true }).catch(a.never);
				})
			)
		)
	).done(d, d);
};
