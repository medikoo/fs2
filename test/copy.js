"use strict";

var path = require("path")
  , fs   = require("fs")
  , pg   = path.resolve(__dirname, "./__playground/copy");

module.exports = {
	"Success": function (t, a, d) {
		var src = pg + "/sample.js", dst = pg + "/sample.copy.js";
		t(src, dst, function (err) {
			if (err) {
				d(err);
				return;
			}
			fs.readFile(src, "utf8", function (err2, srcContent) {
				if (err2) {
					d(err2);
					return;
				}
				fs.readFile(dst, "utf8", function (err3, dstContent) {
					if (err3) {
						d(err3);
						return;
					}
					a(dstContent, srcContent, "Content");

					fs.stat(src, function (err4, srcStats) {
						if (err4) {
							d(err4);
							return;
						}
						fs.stat(dst, function (err5, dstStats) {
							if (err5) {
								d(err5);
								return;
							}
							a(dstStats.mode, srcStats.mode);
							fs.unlink(dst, d);
						});
					});
				});
			});
		});
	},
	"Deep": function (t, a, d) {
		var src = pg + "/sample.js", dst = pg + "/deep/path/sample.copy.js";
		return t(src, dst, { intermediate: true }).done(function () {
			fs.readFile(src, "utf8", function (err, srcContent) {
				if (err) {
					d(err);
					return;
				}
				fs.readFile(dst, "utf8", function (err2, dstContent) {
					if (err2) {
						d(err2);
						return;
					}
					a(dstContent, srcContent, "Content");
					fs.unlink(dst, d);
				});
			});
		}, d);
	},
	"Wrong path": function (t, a, d) {
		t(pg + "/sample.js", pg + "/:;\\//wrong-filename").done(a.never, function (e) {
			a(e.code, "ENOENT", "Path error");
			d();
		});
	},
	"Loose": function (t, a, d) {
		t(pg + "/:;\\//wrong-filename", pg + "/sample-test.js", { loose: true }).done(function (
			result
		) {
			a(result, false);
			d();
		}, d);
	},
	"Loose with mode": function (t, a, d) {
		t(pg + "/:;\\//wrong-filename", pg + "/sample-test2.js", { loose: true, mode: 33188 }).done(
			function (result) {
				a(result, false);
				d();
			},
			d
		);
	}
};
