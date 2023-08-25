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
	mkdir(nested, { intermediate: true })(mkdir(nested2, { intermediate: true }))(() =>
		writeFile(resolve(nested, "../foo"), "bar")
	)(() =>
		t(rootPath)(a.never, err => { a(err.code, "ENOTEMPTY", "Default on not empty"); })(() =>
			t(rootPath, { recursive: true })(a.never, err => {
				a(err.code, "ENOTEMPTY", "Recursive not empty");
			})
		)(() => {
			const path = resolve(rootPath, "one/four");
			return t(path, { recursive: true })(() =>
				lstat(path)(a.never, err => { a(err.code, "ENOENT", "Recursive on empty"); })
			);
		})(() =>
			t(nested)(() => lstat(nested)(a.never, err => { a(err.code, "ENOENT", "Plain"); }))
		)(() => t(nested, { loose: true })(res => { a(res, null, "Loose option"); }, a.never))(() =>
			t(rootPath, { recursive: true, force: true })(() =>
				lstat(rootPath)(a.never, err => { a(err.code, "ENOENT", "Recursive and forced"); })
			)
		)
	).done(d, d);
};
