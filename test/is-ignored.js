/* eslint max-lines: off */

"use strict";

const fs            = require("fs")
    , { resolve }   = require("path")
    , noop          = require("es5-ext/function/noop")
    , deferred      = require("deferred")
    , { delay }     = deferred
    , { promisify } = deferred
    , mkdir         = promisify(fs.mkdir)
    , writeFile     = promisify(fs.writeFile)
    , unlink        = promisify(fs.unlink)
    , rmdir         = promisify(fs.rmdir)
    , modes         = require("../lib/ignore-modes")
    , pgPath        = resolve(__dirname, "./__playground/is-ignored");

module.exports = function (t, a, d) {
	let invoked = null, testIsRoot, watcher;
	const DELAY = 100
	    , gitRoot = resolve(pgPath, ".git")
	    , rootFile = resolve(pgPath, ".gitignore")
	    , onePath = resolve(pgPath, "one")
	    , oneFile = resolve(onePath, ".gitignore")
	    , twoPath = resolve(onePath, "two")
	    , twoFile = resolve(twoPath, ".gitignore")
	    , twoOtherFile = resolve(twoPath, ".ignore")
	    , twoFooPath = resolve(twoPath, "foo");

	modes.test = {
		filename: ".ignore",
		isRoot: (testIsRoot = function (path) {
			const promise = deferred(path === onePath);
			promise.close = noop;
			return promise;
		}),
		isRootWatcher: testIsRoot
	};

	// Make .git dir
	deferred(
		mkdir(gitRoot), mkdir(onePath)(() => mkdir(twoPath))
	)(
		delay(() => {
			t(
				"git", resolve(gitRoot, "foo/bar")
			)(value => { a(value, true, "Ignore gitrepo file"); }).done();
			watcher = t("git", twoFooPath, { watch: true });
			watcher.on("change", arg => {
				a(invoked, null, "Invoked once");
				invoked = arg;
			});
			watcher.done();
			return t("git", twoFooPath);
		}, DELAY)
	)(
		delay(value => {
			a(value, false, "#1");

			// Write root .gitignore with "foo"
			return writeFile(rootFile, "foo");
		}, DELAY)
	)(
		delay(() => {
			a(invoked, true, "#2 event");
			invoked = null;
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, true, "#2");

		// Write root/one .gitignore with "/two/foo"
		return writeFile(oneFile, "/two/foo");
	})(
		delay(() => {
			a(invoked, null, "#3 event");
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, true, "#3");

		// Write root/one/two .gitignore with "!foo"
		return writeFile(twoFile, "!foo");
	})(
		delay(() => {
			a(invoked, false, "#4 event");
			invoked = null;
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "#4");

		// Remove root .gitignore
		// Remove root/one .gitignore
		return deferred(unlink(rootFile), unlink(oneFile));
	})(
		delay(() => {
			a(invoked, null, "#5 event");
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "#5");

		// Remove root/one/two .gitignore
		return unlink(twoFile);
	})(
		delay(() => {
			a(invoked, null, "#6 event");
			invoked = null;
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "#6");

		// Write root/one .gitignore with "/two/foo\n!/two/foo"
		return writeFile(oneFile, "/two/foo\n!/two/foo");
	})(
		delay(() => {
			a(invoked, null, "#7 event");
			invoked = null;
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "#7");

		// Write root .gitignore with "two"
		return writeFile(rootFile, "two");
	})(
		delay(() => {
			a(invoked, null, "#8 event");
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "#8");

		// Remove root .gitignore
		return unlink(rootFile);
	})(
		delay(() => {
			a(invoked, null, "#9 event");
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "#9");

		// Write root .gitignore with "/one"
		return writeFile(rootFile, "/one");
	})(
		delay(() => {
			a(invoked, true, "#10 event");
			invoked = null;
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, true, "#10");
		watcher.close();

		// Write root .gitignore with "one\n!one/two/foo"
		// Remove root/one .gitignore
		return deferred(writeFile(rootFile, "one\n!one/two/foo"), unlink(oneFile));
	})(
		delay(() => {
			a(invoked, null, "#11 event");
			invoked = null;
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, true, "#11");

		// Remove root .gitignore
		return unlink(rootFile);
	})(
		delay(() => {
			invoked = null;

			watcher = t(["git", "test"], twoFooPath, { watch: true });
			watcher.on("change", arg => {
				a(invoked, null, "Invoked once");
				invoked = arg;
			});
			watcher.done();
			return t("git", twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "Both #1");

		// Write root .gitignore with "foo"
		return writeFile(rootFile, "foo");
	})(
		delay(() => {
			a(invoked, true, "Both #2");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY * 2)
	)(value => {
		a(value, true, "Both #2");
		return writeFile(twoOtherFile, "!foo");
	})(
		delay(() => {
			a(invoked, false, "Both #3");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "Both #3");
		return writeFile(rootFile, "one\n");
	})(
		delay(() => {
			a(invoked, true, "Both #4");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY)
	)(value => {
		a(value, true, "Both #4");
		return unlink(rootFile);
	})(
		delay(() => {
			a(invoked, false, "Both #5");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "Both #5");
		return writeFile(twoOtherFile, "foo");
	})(
		delay(() => {
			a(invoked, true, "Both #6");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY)
	)(value => {
		a(value, true, "Both #6");
		return writeFile(twoFile, "!foo");
	})(
		delay(() => {
			a(invoked, null, "Both #7");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY)
	)(value => {
		a(value, true, "Both #7");
		return writeFile(twoOtherFile, "!foo");
	})(
		delay(() => {
			a(invoked, false, "Both #8");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "Both #8");
		return writeFile(twoFile, "foo");
	})(
		delay(() => {
			a(invoked, null, "Both #9");
			invoked = null;
			return t(["git", "test"], twoFooPath);
		}, DELAY)
	)(value => {
		a(value, false, "Both #9");
		watcher.close();
	})(delay(() => deferred(unlink(twoFile), unlink(twoOtherFile)), DELAY))(
		delay(() => {
			t(null, twoFooPath, { globalRules: "foo" })(value => {
				a(value, true, "Global: Direct");
			});
			t(null, twoFooPath, { globalRules: ["one"] })(value => {
				a(value, true, "Global: Upper");
			});
			t(null, twoFooPath, { globalRules: ["bar"] })(value => {
				a(value, false, "Global: Not matching");
			});
			delete modes.test;
			return deferred(rmdir(gitRoot), rmdir(twoPath)(() => rmdir(onePath)))(false);
		}, DELAY)
	).done(d, d);
};
