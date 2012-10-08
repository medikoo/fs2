'use strict';

var deferred = require('deferred')
  , resolve  = require('path').resolve
  , original = require('fs').unlink

  , unlink;

unlink = function (path) {
	var def = deferred();
	original(path, function (err, stats) { def.resolve(err || stats); });
	return def.promise;
};
unlink.returnsPromise = true;

module.exports = exports = function (path/*, callback*/) {
	return unlink(resolve(String(path))).cb(arguments[1]);
};
exports.returnsPromise = true;
exports.unlink = unlink;
