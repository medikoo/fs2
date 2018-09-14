"use strict";

var resolve   = require("path").resolve
  , lstat     = require("../lstat")
  , mkdir     = require("../mkdir")
  , writeFile = require("../write-file")
  , pg        = resolve(__dirname, "__playground")
  , rootPath  = resolve(pg, "rmdir")
  , nested    = resolve(rootPath, "one/two/three/dir")
  , nested2   = resolve(rootPath, "one/four/five/six");

module.exports = function (t, a, d) {
	mkdir(nested, { intermediate: true })(mkdir(nested2, { intermediate: true }))(function () {
		return writeFile(resolve(nested, "../foo"), "bar");
	})(function () {
		return t(
			rootPath
		)(a.never, function (err) {
			a(err.code, "ENOTEMPTY", "Default on not empty");
		})(function () {
			return t(rootPath, {
				recursive: true
			})(a.never, function (err) { a(err.code, "ENOTEMPTY", "Recursive not empty"); });
		})(function () {
			var path = resolve(rootPath, "one/four");
			return t(path, { recursive: true })(function () {
				return lstat(
					path
				)(a.never, function (err) { a(err.code, "ENOENT", "Recursive on empty"); });
			});
		})(function () {
			return t(nested)(function () {
				return lstat(nested)(a.never, function (err) { a(err.code, "ENOENT", "Plain"); });
			});
		})(function () {
			return t(nested, {
				loose: true
			})(function (res) { a(res, null, "Loose option"); }, a.never);
		})(function () {
			return t(rootPath, { recursive: true, force: true })(function () {
				return lstat(
					rootPath
				)(a.never, function (err) { a(err.code, "ENOENT", "Recursive and forced"); });
			});
		});
	}).done(d, d);
};
