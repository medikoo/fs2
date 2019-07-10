"use strict";

module.exports = function (t, a) {
	var fn, invoked, mfn, fnX, fnY, fnZ;
	fn = function (pathIgnored) {
		return { emit: function () { return true; }, close: function () { invoked = true; } };
	};
	invoked = false;

	mfn = t(fn);
	fnX = mfn("foo");
	fnY = mfn("foo");
	fnZ = mfn("bar");
	a(invoked, false, "Pre calls");

	fnZ.close();
	a(invoked, true, "After single call");
	invoked = false;

	fnZ.close();
	a(invoked, false, "Second close call has no effect");
	invoked = false;

	fnX.close();
	a(invoked, false, "After one of two calls");
	invoked = false;
	fnY.close();
	a(invoked, true, "After two of two calls");
	invoked = false;
	fnX.close();
	a(invoked, false, "Second close call has no effect (two calls case)");
	invoked = false;
};
