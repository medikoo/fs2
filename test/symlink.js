"use strict";

const { promisify } = require("deferred")
    , fs            = require("fs")
    , path          = require("path")
    , { resolve }   = path
    , lstat         = promisify(fs.lstat)
    , unlink        = promisify(fs.unlink)
    , rootPath      = resolve(__dirname, "./__playground/symlink")
    , base          = resolve(rootPath, "from")
    , regular       = resolve(rootPath, "foo")
    , deep          = resolve(rootPath, "foo/bar");

module.exports = function (t) {
	return {
		Regular(a, d) {
			t(base, regular)
				.then(() => lstat(regular))
				.then(stats => { a(stats.isSymbolicLink(), true); })
				.then(() => unlink(regular))
				.done(d, d);
		},
		Error(a, d) {
			t(base, deep)(a.never, () => { a.ok(true, ""); }).done(d, d);
		}
	};
};
