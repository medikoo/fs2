"use strict";

var lstat     = require("../lstat")
  , mkdir     = require("../mkdir")
  , writeFile = require("../write-file")
  , testFile  = require("path").resolve(__dirname, "__playground/rm-file")
  , testDir   = require("path").resolve(__dirname, "__playground/rm-dir");

module.exports = {
	File: function (t, a, d) {
		return writeFile(testFile, "foo")(function () {
			return lstat(testFile)(function () {
				return t(testFile)(function () {
					return lstat(testFile)(a.never, function (err) {
						a(err.code, "ENOENT");
						return t(testFile + "bla", { loose: true }).catch(a.never);
					});
				});
			});
		}).done(d, d);
	},
	Directory: function (t, a, d) {
		mkdir(testDir)(function () {
			return lstat(testDir)(function () {
				return t(testDir)(function () {
					return lstat(testDir)(a.never, function (err) { a(err.code, "ENOENT"); });
				});
			});
		}).done(d, d);
	}
};
