'use strict';

var lstat = require('../lib/lstat')

  , testFile = require('path').resolve(__dirname, '__playground/lchmod/test');

module.exports = function (t, a, d) {
	if (process.platform === 'win32') {
		a(t, null);
		d();
		return;
	}
	lstat(testFile)(function (stats) {
		var org = stats.mode;
		return t(testFile, 511)(function () {
			return lstat(testFile)(function (stats) {
				a(stats.mode & 511, 511);
				return t(testFile, org);
			});
		});
	}, a.never).end(d, d);
};
