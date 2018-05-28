'use strict';

var assert = require('assert');
var gutil = require('gulp-util');
var es = require('event-stream');
var gulpCssToc = require('../');

describe('gulp-html-toc', function() {
  it('should export a function (sound check)', function() {
    assert.equal(typeof gulpCssToc, 'function');
  });
});
