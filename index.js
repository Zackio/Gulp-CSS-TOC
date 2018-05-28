'use strict';
var gutil = require('gulp-util');
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

		array_of_css_header_blocks.forEach(function(entry) {
			entry = entry.replace('== */', '');
			entry = entry.replace('/* ', '- ');
			data += entry;
		});

		data += "\n*/\n\n"; // Close Comment

		if (file.isStream()) {
			console.log('is stream');
		}
		file.contents = Buffer.concat([
			new Buffer(data, 'utf8'),
			file.contents
		]);

		this.push(file);
		cb();

	});
};
