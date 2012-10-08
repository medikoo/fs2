'use strict';

var deferred = require('deferred')
  , resolve  = require('path').resolve
  , original = require('fs').lstat

  , lstat;

lstat = function (path) {
	var def = deferred();
	original(path, function (err, stats) {
		def.resolve(err || stats);
	});
	return def.promise;
};
lstat.returnsPromise = true;

module.exports = exports = function (path/*, callback*/) {
	var cb = arguments[1];
	path = resolve(String(path));
	return lstat(path).cb(cb);
};
exports.returnsPromise = true;
exports.lstat = lstat;
