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

  it('should emit error on streamed file', function (done) {
      gulp.src(fixtures('*'), { buffer: false })
        .pipe(concat('test.js'))
        .once('error', function (err) {
          err.message.should.eql('gulp-concat: Streaming not supported');
          done();
        });
    });

  it('output from fixture should match expected file in buffer mode',  function(cb) {
    var stream = gulpCssToc();
    var buffer = [];
    var filepath = fixture_file('style');

    stream.write(new Vinyl({
      base: __dirname,
      path: filepath,
      contents: fs.readFileSync(filepath)
    }));

    stream.on('data', function(file) {
      assert(file.isBuffer());
      buffer.push(file);
    });

    stream.on('end', function() {
      assert.equal(buffer.length, 1);
      assert.equal(buffer[0].contents.toString(), expected_file('style'));
      cb();
    });

    stream.end();

  });

  it('should work in stream mode', function(done) {
         var stream = gulpCssToc();

         var filepath = fixture_file('style');

         fixture_file = new Vinyl({
           base: __dirname,
           path: filepath,
           contents: fs.readFileSync(filepath)
         });

         // console.log(fixture_file);
         // assert(fs.existsSync(fixture_file)).to.be.true

          // stream.write( fixture_file );

          stream.write(new Vinyl({
            base: __dirname,
            path: filepath,
            contents: fs.readFileSync(filepath)
          }));

          stream.once('data', function(file){
             assert(file.isStream());
             // assert(file.isBuffer());
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
