"use strict";

var lstat = require("fs").lstat;

module.exports = function (t, a, d) {
	lstat(__filename, function (err, stat) {
		if (err) {
			d(err);
			return;
		}
		a(t(stat), "file", "File");
		lstat(__dirname, function (err2, stat2) {
			if (err2) {
				d(err2);
				return;
			}
			a(t(stat2), "directory", "Directory");
			d();
		});
	});
};
