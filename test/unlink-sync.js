"use strict";

const lstat     = require("../lstat")
    , writeFile = require("../write-file")
    , testFile  = require("path").resolve(__dirname, "__playground/.unlink");

module.exports = function (t, a, d) {
	return writeFile(
		testFile, "foo"
	)(() =>
		lstat(testFile)(() => {
			t(testFile);
			return lstat(testFile)(a.never, err => {
				a(err.code, "ENOENT");
				t(`${ testFile }bla`, { loose: true });
			});
		})
	).done(d, d);
};
