"use strict";

const { resolve } = require("path");

module.exports = function (t, a, d) {
	t(__filename)(result => {
		a(result, false, "Existing non directory");
		return t(__dirname);
	})(result => {
		a(result, true, "Existing directory");
		return t(resolve(__filename, "foo"));
	})(result => { a(result, null, "Existing directory"); }).done(d, d);
};
