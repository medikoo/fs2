'use strict';

var lstat     = require('../lib/lstat')
  , writeFile = require('../lib/write-file')

  , testFile = require('path').resolve(__dirname, '__playground/unlink');

module.exports = function (t, a, d) {
	return writeFile(testFile, 'foo')(function () {
		return lstat(testFile)(function () {
			return t(testFile)(function () {
				return lstat(testFile)(a.never, function (err) {
					a(err.code, 'ENOENT');
				});
			});
		});
	}).end(d, d);
};
