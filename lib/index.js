'use strict';

module.exports = {
	copy:               require('./copy'),
	descriptorsHandler: require('./descriptors-handler'),
	isIgnored:          require('./is-ignored'),
	mkdir:              require('./mkdir'),
	readFile:           require('./read-file'),
	readdir:            require('./readdir'),
	typeByStats:        require('./type-by-stats'),
	watch:              require('./watch'),
	watchPath:          require('./watch-path'),
	writeFile:          require('./write-file')
};
