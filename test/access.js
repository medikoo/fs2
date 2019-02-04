"use strict";

var fs = require("fs");

var execMode = (fs.constants || fs).X_OK;

module.exports = function (t, a, d) {
	t(__filename)(function (result) {
		a(result, undefined, "Success");
		return t(__filename, execMode)(a.never, function (err) { a(err.code, "EACCES", "Error"); });
	}, a.never).done(d, d);
};
