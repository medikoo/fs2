"use strict";

var resolve = require("path").resolve;

module.exports = function (t, a, d) {
	t(__filename)(function (result) {
		a(result, false, "Existing non directory");
		return t(__dirname);
	})(function (result) {
		a(result, true, "Existing directory");
		return t(resolve(__filename, "foo"));
	})(function (result) { a(result, null, "Existing directory"); }).done(d, d);
};
