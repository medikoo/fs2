"use strict";

const { lstat } = require("./lstat");

module.exports = function (path, callback = null) {
	return lstat(path, { loose: true })(stats => {
		if (stats) return stats.isDirectory();
		return null;
	}).cb(callback);
};
module.exports.returnsPromise = true;
