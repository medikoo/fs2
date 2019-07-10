"use strict";

var deferred  = require("deferred")
  , resolve   = require("path").resolve
  , lstat     = require("../lstat")
  , unlink    = require("../unlink")
  , writeFile = require("../write-file")
  , rootPath  = resolve(__dirname, "__playground/rename")
  , name1     = resolve(rootPath, "file1")
  , name2     = resolve(rootPath, "file2");

module.exports = function (t, a, d) {
	writeFile(name1, "fooraz")(function () {
		return lstat(name1)(function (stats1) {
			return t(name1, name2)(function () {
				return deferred(
					lstat(name1)(a.never, function () { a.ok(true, "No first file"); }),
					lstat(name2)(function (stats2) {
						// Do not compare eventual birthtime and ctime
						// as in some envs they may not reflect value of source file
						delete stats1.birthtime;
						delete stats1.birthtimeMs;
						delete stats2.birthtime;
						delete stats2.birthtimeMs;
						delete stats1.ctime;
						delete stats1.ctimeMs;
						delete stats2.ctime;
						delete stats2.ctimeMs;
						a.deep(stats1, stats2, "Same");
						return unlink(name2);
					})
				)(false);
			});
		});
	}).done(d, d);
};
