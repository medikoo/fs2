"use strict";

var last         = require("es5-ext/array/#/last")
  , defineLength = require("es5-ext/function/_define-length")
  , callable     = require("es5-ext/object/valid-callable")
  , d            = require("d")
  , memoize      = require("memoizee")
  , fs           = require("fs")
  , max          = Math.max
  , slice        = Array.prototype.slice
  , limit        = Infinity
  , count        = 0
  , queue        = []
  , release
  , wrap;

release = function () {
	var data, fnCb;
	// eslint-disable-next-line no-unmodified-loop-condition
	while (count < limit && (data = queue.shift())) {
		try {
			data.fn.apply(data.context, data.args);
		} catch (e) {
			fnCb = last.call(data.args);
			if (typeof fnCb === "function") fnCb(e);
		}
	}
};

wrap = function (asyncFn) {
	var self;
	callable(asyncFn);
	return self = defineLength(function () {
		var openCount, args = arguments, context, cb = last.call(args);
		if (!exports.initialized || typeof cb !== "function") return asyncFn.apply(this, arguments);
		if (count >= limit) {
			queue.push({ fn: self, context: this, args: arguments });
			return null;
		}
		openCount = count++;
		context = this;
		args = slice.call(args, 0, -1);
		args.push(function (err, resultIgnored) {
			--count;
			if (err && (err.code === "EMFILE" || err.code === "ENFILE")) {
				if (limit > openCount) limit = openCount;
				queue.push({ fn: self, context: context, args: args });
				release();
				return;
			}
			release();
			if (typeof cb === "function") cb.apply(this, arguments);
		});
		return asyncFn.apply(this, args);
	}, asyncFn.length);
};

module.exports = exports = memoize(function () {
	var open = fs.open, openSync = fs.openSync, close = fs.close, closeSync = fs.closeSync;

	if (exports.initialized) return;

	fs.open = function (path, flags, mode, fnCb) {
		var openCount, args;
		if (count >= limit) {
			queue.push({ fn: fs.open, context: this, args: arguments });
			return;
		}
		openCount = count++;
		args = arguments;
		fnCb = last.call(args);
		open(path, flags, mode, function (err, fd) {
			if (err) {
				--count;
				if (err.code === "EMFILE" || err.code === "ENFILE") {
					if (limit > openCount) limit = openCount;
					queue.push({ fn: fs.open, context: this, args: args });
					release();
					return;
				}
				release();
			}
			if (typeof fnCb === "function") fnCb(err, fd);
		});
	};

	fs.openSync = function (pathIgnored, flagsIgnored, modeIgnored) {
		var result = openSync.apply(this, arguments);
		++count;
		return result;
	};

	fs.close = function (fd, fnCb) {
		close(fd, function (err) {
			if (!err) {
				--count;
				release();
			}
			if (typeof fnCb === "function") fnCb(err);
		});
	};

	fs.closeSync = function (fd) {
		var result;
		result = closeSync(fd);
		--count;
		release();
		return result;
	};

	fs.readdir = wrap(fs.readdir);
	fs.readFile = wrap(fs.readFile); // Needed for Node >=1.2 because of commit e65308053c

	Object.defineProperty(exports, "initialized", d("e", true));
});

Object.defineProperties(exports, {
	initialized: d("ce", false),
	limit: d.gs(
		function () {
			return limit;
		},
		function (nLimit) {
			if (limit >= nLimit) limit = max(nLimit, 5);
		}
	),
	available: d.gs(function () {
		return max(limit - count, 0);
	}),
	taken: d.gs(function () {
		return count;
	}),
	open: d(function () {
		++count;
	}),
	close: d(function () {
		--count;
		if (release) release();
	}),
	wrap: d(wrap)
});
