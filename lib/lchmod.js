'use strict';

var deferred = require('deferred')
  , resolve  = require('path').resolve
  , original = require('fs').lchmod

  , lchmod;

lchmod = function (path, mode) {
	var def = deferred();
	original(path, mode, function (err, stats) { def.resolve(err || stats); });
	return def.promise;
};
lchmod.returnsPromise = true;

if (original) {
	module.exports = exports = function (path, mode/*, callback*/) {
		return lchmod(resolve(String(path)), mode).cb(arguments[2]);
	};
	exports.returnsPromise = true;
	exports.lchmod = lchmod;
} else {
	module.exports = null;
}
