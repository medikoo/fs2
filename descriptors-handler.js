/* eslint max-lines: off */

"use strict";

const last         = require("es5-ext/array/#/last")
    , defineLength = require("es5-ext/function/_define-length")
    , callable     = require("es5-ext/object/valid-callable")
    , d            = require("d")
    , memoize      = require("memoizee")
    , fs           = require("fs");

const { max } = Math, { slice } = Array.prototype, queue = [], debugStats = { fd: 0, unknown: 0 };

let count = 0, limit = Infinity;

const release = function () {
	let data, fnCb;
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

const wrap = function (asyncFn, type) {
	let self;
	debugStats[type] = 0;
	callable(asyncFn);
	return (self = defineLength(function (...args) {
		const cb = last.call(args);
		if (!exports.initialized || typeof cb !== "function") return asyncFn.apply(this, args);
		if (count >= limit) {
			queue.push({ fn: self, context: this, args });
			return null;
		}
		const openCount = count++;
		const context = this;
		args = slice.call(args, 0, -1);
		args.push(function (err, result) {
			--debugStats[type];
			--count;
			if (err && (err.code === "EMFILE" || err.code === "ENFILE")) {
				if (limit > openCount) limit = openCount;
				queue.push({ fn: self, context, args });
				release();
				return;
			}
			release();
			if (typeof cb === "function") cb.call(this, err, result);
		});
		++debugStats[type];
		return asyncFn.apply(this, args);
	}, asyncFn.length));
};

module.exports = exports = memoize(() => {
	const { open, openSync, close, closeSync } = fs;

	if (exports.initialized) return;

	fs.open = function (path, flags, mode, fnCb) {
		if (count >= limit) {
			// eslint-disable-next-line prefer-rest-params
			queue.push({ fn: fs.open, context: this, args: arguments });
			return;
		}
		const openCount = count++;
		// eslint-disable-next-line prefer-rest-params
		const args = arguments;
		fnCb = last.call(args);
		++debugStats.fd;
		open(path, flags, mode, function (err, fd) {
			if (err) {
				--debugStats.fd;
				--count;
				if (err.code === "EMFILE" || err.code === "ENFILE") {
					if (limit > openCount) limit = openCount;
					queue.push({ fn: fs.open, context: this, args });
					release();
					return;
				}
				release();
			}
			if (typeof fnCb === "function") fnCb(err, fd);
		});
	};

	fs.openSync = function (pathIgnored, flagsIgnored, modeIgnored) {
		const result = openSync.call(this, pathIgnored, flagsIgnored, modeIgnored);
		++debugStats.fd;
		++count;
		return result;
	};

	fs.close = function (fd, fnCb) {
		close(fd, err => {
			if (!err) {
				--debugStats.fd;
				--count;
				release();
			}
			if (typeof fnCb === "function") fnCb(err);
		});
	};

	fs.closeSync = function (fd) {
		const result = closeSync(fd);
		--debugStats.fd;
		--count;
		release();
		return result;
	};

	fs.readdir = wrap(fs.readdir, "readdir");
	// Needed for Node >=1.2 because of commit e65308053c
	fs.readFile = wrap(fs.readFile, "readFile");

	Object.defineProperty(exports, "initialized", d("e", true));
});

Object.defineProperties(exports, {
	initialized: d("ce", false),
	limit: d.gs(() => limit, nLimit => { if (limit >= nLimit) limit = max(nLimit, 5); }),
	available: d.gs(() => max(limit - count, 0)),
	taken: d.gs(() => count),
	open: d(() => {
		++debugStats.unknown;
		++count;
	}),
	close: d(() => {
		--debugStats.unknown;
		--count;
		if (release) release();
	}),
	wrap: d(wrap),
	debugStats: d(debugStats),
});
