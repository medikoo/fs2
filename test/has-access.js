"use strict";

var resolve = require("path").resolve
  , fs      = require("fs");

var execMode = (fs.constants || fs).X_OK;

module.exports = function (t, a, d) {
	t(__filename)
		.then(function (result) {
			a(result, true, "Success");
			return t(__filename, { mode: execMode });
		}, a.never)
		.then(function (result) {
			a(result, false, "No access");
			return t(resolve(__filename, "n-a"), { loose: true });
		})
		.then(function (result) { a(result, null, "Loose"); })
		.done(d, d);
};
