'use strict';
var gutil = require('gulp-util');
// through2 is a thin wrapper around node transform streams
var through = require('through2');

function gulpTocCss(options) {

	 var stream = through.obj(function(file, enc, cb) {
		 
		// Pass null files back
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		// we don't do streams (yet)
	  if (file.isStream()) {
	     this.emit('error', new Error('gulp-toc-css: Streaming not supported'));
	     cb();
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

		// Check file is buffer
		if (file.isBuffer()) {
			// Prepend TOC to beginning of given file
		 file.contents = Buffer.concat([
			 new Buffer(data, 'utf8'),
			 file.contents
		 ]);
	 }

		// make sure the file goes through the next gulp plugin
		this.push(file);

		// tell the stream engine that we are done with this file
		cb();
});

	// returning the file stream
	return stream;

}

// exporting the plugin main function
module.exports = gulpTocCss;
