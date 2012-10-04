'use strict';

var fs = require('fs')

  , readFile = fs.readFile, unlink = fs.unlink

  , path = require('path').resolve(__dirname, './__playground/write-test.js');

module.exports = function (t, a, d) {
	t(path, 'raz', function (err) {
		a(err, null, '#1');
	});
	t(path, 'dwa', function (err) {
		a(err, null, '#2');
	});
	t(path, 'trzy', function (err) {
		a(err, null, '#3');
		readFile(path, function (err, content) {
			a(String(content), 'trzy', "Last written");
			unlink(path, d);
		});
	});
};
