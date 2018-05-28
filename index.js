'use strict';
var gutil = require('gulp-util');
// through2 is a thin wrapper around node transform streams
var through = require('through2');

module.exports = function gulpToc(options) {

	return through.obj(function(file, enc, cb) {

		// Check for file
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		var re = /== \*\/\n\/\*\s+([aA-zZ0-9 ]+\b)/g;

		var str = file.contents.toString('utf8');

		var data = '/*'; // Open Comment

		// Gets array of heades from css file contents
		var array_of_css_header_blocks = str.match(re);

		// Removes opening and end of comment syntax for each item, relacing with a dash at the beginning
		array_of_css_header_blocks.forEach(function(entry) {
			entry = entry.replace('== */', '');
			entry = entry.replace('/* ', '- ');
			data += entry;
		});

		data += "\n*/\n\n"; // Close Comment

		if (file.isStream()) {
			console.log('is stream');
		}

		 // Prepend TOC to beginning of given file
		file.contents = Buffer.concat([
			new Buffer(data, 'utf8'),
			file.contents
		]);

		this.push(file);
		cb();

	});
};
