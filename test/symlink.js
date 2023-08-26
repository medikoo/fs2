"use strict";

const { promisify } = require("deferred")
    , fs            = require("fs")
    , path          = require("path")
    , { resolve }   = path
    , lstat         = promisify(fs.lstat)
    , unlink        = promisify(fs.unlink)
    , rmdir         = require("../rmdir")
    , rootPath      = resolve(__dirname, "./__playground/symlink")
    , base          = resolve(rootPath, "from")
    , regular       = resolve(rootPath, "foo")
    , deep          = resolve(rootPath, "foo/bar");

module.exports = function (t) {
	return {
		Regular(a, d) {
			t(base, regular)
				.then(result => {
					a(result, true);
					return lstat(regular);
				})
				.then(stats => { a(stats.isSymbolicLink(), true); })
				.then(() => unlink(regular))
				.done(d, d);
		},
		Intermediate(a, d) {
			t(base, deep, { intermediate: true })
				.then(result => {
					a(result, true);
					return lstat(deep);
				})
				.then(stats => { a(stats.isSymbolicLink(), true); })
				.then(() => rmdir(path.dirname(deep), { force: true }))
				.done(d, d);
		},
		Loose(a, d) {
			t(base, regular)
				.then(result => {
					a(result, true);
					return lstat(regular);
				})
				.then(stats => { a(stats.isSymbolicLink(), true); })
				.then(() => t(base, regular, { loose: true }))
				.then(result => {
					a(result, false);
					return unlink(regular);
				})
				.done(d, d);
		},
		Force(a, d) {
			t(base, regular)
				.then(result => {
					a(result, true);
					return lstat(regular);
				})
				.then(stats => { a(stats.isSymbolicLink(), true); })
				.then(() => t(resolve(rootPath, "other"), regular, { force: true }))
				.then(result => {
					a(result, true);
					return lstat(regular);
				})
				.then(stats => { a(stats.isSymbolicLink(), true); })
				.then(() => unlink(regular))
				.done(d, d);
		},
		Error(a, d) {
			t(base, deep)(a.never, () => { a.ok(true, ""); }).done(d, d);
		}
	};
};
