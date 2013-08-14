'use strict';

var deferred  = require('deferred')
  , resolve   = require('path').resolve
  , lstat     = require('../lib/lstat')
  , unlink    = require('../lib/unlink')
  , writeFile = require('../lib/write-file')

  , root = resolve(__dirname, '__playground/rename')
  , name1 = resolve(root, 'file1'), name2 = resolve(root, 'file2');

module.exports = function (t, a, d) {
	writeFile(name1, 'fooraz')(function () {
		return lstat(name1)(function (stats1) {
			return t(name1, name2)(function () {
				return deferred(lstat(name1)(a.never, function () {
					a.ok(true, "No first file");
				}), lstat(name2)(function (stats2) {
					a.deep(stats1, stats2, "Same");
					return unlink(name2);
				}))(false);
			});
		});
	}).done(d, d);
};
