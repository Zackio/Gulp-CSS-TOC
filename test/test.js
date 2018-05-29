'use strict';

require('mocha')
var assert = require('assert');
var gutil = require('gulp-util');
var es = require('event-stream');
var gulpCssToc = require('../');
var path = require('path');
var fs = require('fs');
var Vinyl = require('vinyl');
var gulp = require('gulp');

describe('gulp-html-toc', function() {

  it('should export a function (sound check)', function() {
    assert.equal(typeof gulpCssToc, 'function');
  });

  function read(filepath) {
    return fs.readFileSync(filepath, 'utf8');
  }
  function fixture_file(name) {
    return path.resolve(__dirname, 'fixtures', name + '.css');
  }
  function expected_file(name) {
    return read(path.resolve(__dirname, 'expected', name + '.css'));
  }

  var fixtures = function (glob) { return path.join(__dirname, 'fixtures', glob); }

  it('should emmit error on passed stream',  function( done ) {
    gulp.src(__dirname + "/fixtures/style.css", { buffer: false })
    .pipe(gulpCssToc())
    .once('error', function (err) {
      assert.equal(err, 'Error: gulp-toc-css: Streaming not supported');
      done();
    });
  });

  it('should output buffer',  function( done ) {
    gulp.src(__dirname + "/fixtures/style.css", { buffer: true })
    .pipe(gulpCssToc())
    .once('data', function (file) {
      assert(file.isBuffer());
      done();
    })
  });

  it('output from fixture should match expected file in buffer mode',  function(done) {
    gulp.src(__dirname + "/fixtures/style.css", { buffer: true })
    .pipe(gulpCssToc())
    .once('data', function(file) {
      assert.equal(file.contents.toString(), expected_file('style'));
      done();
    });
  });

  it('should let null files pass through', function(done) {
    var stream = gulpCssToc(),
    n = 0;
    stream.pipe(es.through(function(file) {
      assert.equal(file.path, 'null.css');
      assert.equal(file.contents,  null);
      n++;
    }, function() {
      assert.equal(n, 1);
      done();
    }));
    stream.write(new gutil.File({
      path: 'null.css',
      contents: null
    }));
    stream.end();
  });

});
