"use strict";

const { resolve } = require("path");

module.exports = function (t, a, d) {
	t(__filename)(result => {
		a(result, true, "Existing file");
		return t(__dirname);
	})(result => {
		a(result, false, "Existing non file");
		return t(resolve(__filename, "foo"));
	})(result => { a(result, null, "Not existing"); }).done(d, d);
};
