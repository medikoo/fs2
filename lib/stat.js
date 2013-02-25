'use strict';

var deferred = require('deferred')
  , resolve  = require('path').resolve
  , original = require('fs').stat

  , stat;

stat = function (path) {
	var def = deferred();
	original(path, function (err, stats) { def.resolve(err || stats); });
	return def.promise;
};
stat.returnsPromise = true;

module.exports = exports = function (path/*, callback*/) {
	return stat(resolve(String(path))).cb(arguments[1]);
};
exports.returnsPromise = true;
exports.stat = stat;
