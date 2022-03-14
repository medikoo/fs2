"use strict";

const path      = require("path")
    , readdir   = require("../readdir")
    , mkdir     = require("../mkdir")
    , writeFile = require("../write-file")
    , pg        = path.resolve(__dirname, "__playground")
    , rootPath  = path.resolve(pg, "rmdir-sync")
    , nested    = path.resolve(rootPath, "one/two/three/dir")
    , nested2   = path.resolve(rootPath, "one/four/five/six");

module.exports = function (t, a) {
	return Promise.all([
		mkdir(nested, { intermediate: true }), mkdir(nested2, { intermediate: true })
	])
		.then(() => writeFile(path.resolve(nested, "../foo"), "bar"))
		.then(() => {
			try {
				t(rootPath);
				throw new Error("Unexpected");
			} catch (error) {
				if (!error.message.includes("ENOTEMPTY")) throw error;
				a(error.message.includes("ENOTEMPTY"), true);
			}

			t(rootPath, { recursive: true });
			return readdir(rootPath).then(content => { a.deep(content, []); });
		});
};
