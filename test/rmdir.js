"use strict";

const { resolve } = require("path")
    , lstat       = require("../lstat")
    , mkdir       = require("../mkdir")
    , writeFile   = require("../write-file")
    , pg          = resolve(__dirname, "__playground")
    , rootPath    = resolve(pg, "rmdir")
    , nested      = resolve(rootPath, "one/two/three/dir")
    , nested2     = resolve(rootPath, "one/four/five/six");

module.exports = function (t, a, d) {
	// Setup
	mkdir(nested, { intermediate: true })(mkdir(nested2, { intermediate: true }))(() =>
		writeFile(resolve(nested, "../foo"), "bar")
	)
		// Do not remove non empty (with default options)
		.then(() =>
			t(rootPath)(a.never, err => { a(err.code, "ENOTEMPTY", "Default on not empty"); })
		)
		// Do not remove non empty (with recursive option)
		.then(() =>
			t(rootPath, { recursive: true })(a.never, err => {
				a(err.code, "ENOTEMPTY", "Recursive not empty");
			})
		)
		// Remove recrsively empty directories
		.then(() => {
			const path = resolve(rootPath, "one/four");
			return t(path, { recursive: true })(() =>
				lstat(path)(a.never, err => { a(err.code, "ENOENT", "Recursive on empty"); })
			);
		})
		// Remove empty directory (with default options)
		.then(() =>
			t(nested)(() => lstat(nested)(a.never, err => { a(err.code, "ENOENT", "Plain"); }))
		)
		// Ignore not existing directory (with loose option)
		.then(() => t(nested, { loose: true })(res => { a(res, null, "Loose option"); }, a.never))
		// Remove non empty directory without directories (with force option)
		.then(() =>
			t(resolve(nested, "../"), { force: true })(() =>
				lstat(resolve(nested, "../"))(a.never, err => { a(err.code, "ENOENT", "Forced"); })
			)
		)

		// Remove non empty deep directory (with force and recursive option)
		.then(() =>
			t(rootPath, { recursive: true, force: true })(() =>
				lstat(rootPath)(a.never, err => { a(err.code, "ENOENT", "Recursive and forced"); })
			)
		)

		.done(d, d);
};
