"use strict";

var resolve = require("path").resolve;

module.exports = function (t, a, d) {
	t(__filename)(function (stats) {
		a(stats.isFile(), true, "Success");
		return t(resolve(__dirname, "n/a"))(a.never, function (err) {
			a(err.code, "ENOENT", "Error");
		});
	}, a.never).done(d, d);
};
