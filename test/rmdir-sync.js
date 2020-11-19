"use strict";

const { resolve } = require("path")
    , lstat       = require("../lstat")
    , mkdir       = require("../mkdir")
    , writeFile   = require("../write-file")
    , pg          = resolve(__dirname, "__playground")
    , rootPath    = resolve(pg, "rmdir-sync")
    , nested      = resolve(rootPath, "one/two/three/dir")
    , nested2     = resolve(rootPath, "one/four/five/six");

module.exports = function (t, a) {
	return Promise.all([
		mkdir(nested, { intermediate: true }), mkdir(nested2, { intermediate: true })
	])
		.then(() => writeFile(resolve(nested, "../foo"), "bar"))
		.then(() => {
			try {
				t(rootPath);
				throw new Error("Unexpected");
			} catch (error) {
				a(error.code, "ENOTEMPTY", "Default on not empty");
			}

			t(rootPath, { recursive: true, force: true });
			return lstat(rootPath).then(a.never, err => {
				a(err.code, "ENOENT", "Recursive and forced");
			});
		});
};
