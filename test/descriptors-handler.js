"use strict";

var fs = require("fs");

module.exports = function (t, a, d) {
	var done = 0;
	t();
	fs.closeSync(fs.openSync(__filename, "r"));
	fs.open(__filename, "r", function (err, fd) {
		if (err) {
			d(err);
			return;
		}
		a(typeof fd, "number", "Open");
		fs.close(fd, function (err2) {
			if (err2 || done++) {
				d(err2);
			}
		});
	});
	fs.readdir(__dirname, function (err, result) {
		if (err) {
			d(err);
			return;
		}
		a(Array.isArray(result), true, "Readdir");
		if (done++) {
			d();
		}
	});
};
