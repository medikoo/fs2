'use strict';

var noop     = require('es5-ext/lib/Function/noop')
  , extend   = require('es5-ext/lib/Object/extend')
  , memoize  = require('memoizee')
  , ee       = require('event-emitter')
  , deferred = require('deferred')

  , isPromise = deferred.isPromise;

module.exports = function (fn/*, options*/) {
	var factory, memoized;
	if (fn.memoized) {
		return fn;
	}
	memoized = memoize(fn, extend(Object(arguments[1]), { refCounter: true }));
	factory = function () {
		var watcher, emitter, pipe, args, def;
		args = arguments;
		watcher = memoized.apply(this, arguments);
		if (isPromise(watcher)) {
			def = deferred();
			emitter = def.promise;
			def.resolve(watcher);
		} else {
			emitter = ee();
		}
		pipe = ee.pipe(watcher, emitter);
		emitter.close = function () {
			emitter.close = noop;
			pipe.close();
			if (memoized.clearRef.apply(this, args)) {
				watcher.close();
			}
		};
		return emitter;
	};
	factory.clear = memoized.clear;
	factory.memoized = true;
	return factory;
};
