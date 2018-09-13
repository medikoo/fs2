"use strict";

var deferred = require("deferred")
  , resolve  = require("path").resolve
  , original = require("fs").stat;

var stat = function (path) {
	var def = deferred();
	original(path, function (err, stats) {
		if (err) def.reject(err);
		else def.resolve(stats);
	});
	return def.promise;
};
stat.returnsPromise = true;

module.exports = function (path/*, callback*/) {
	return stat(resolve(String(path))).cb(arguments[1]);
};
module.exports.returnsPromise = true;
module.exports.stat = stat;
