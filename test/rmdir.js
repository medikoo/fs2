'use strict';

var resolve   = require('path').resolve
  , lstat     = require('../lib/lstat')
  , mkdir     = require('../lib/mkdir')
  , writeFile = require('../lib/write-file')

  , pg = resolve(__dirname, '__playground')

  , root = resolve(pg, 'rmdir')
  , nested = resolve(root, 'one/two/three/dir')
  , nested2 = resolve(root, 'one/four/five/six');

module.exports = function (t, a, d) {
	mkdir(nested, { intermediate: true })(mkdir(nested2,
		{ intermediate: true }))(function () {
		return writeFile(resolve(nested, '../foo'), 'bar');
	})(function () {
		return t(root)(a.never, function (err) {
			a(err.code, 'ENOTEMPTY', "Default on not empty");
		})(function () {
			return t(root, { recursive: true })(a.never, function (err) {
				a(err.code, 'ENOTEMPTY', "Recursive not empty");
			});
		})(function () {
			var path = resolve(root, 'one/four');
			return t(path, { recursive: true })(function () {
				return lstat(path)(a.never, function (err) {
					a(err.code, 'ENOENT', "Recursive on empty");
				});
			});
		})(function () {
			return t(nested)(function () {
				return lstat(nested)(a.never, function (err) {
					a(err.code, 'ENOENT', "Plain");
				});
			});
		})(function () {
			return t(root, { recursive: true, force: true })(function () {
				return lstat(root)(a.never, function (err) {
					a(err.code, 'ENOENT', "Recursive and forced");
				});
			});
		});
	}).end(d, d);
};
