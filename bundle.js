// GULPFILE INSPIRED FROM:
// http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

// MIGHT BE INTERESTING TO LOOK AT AS WELL
// http://lincolnloop.com/blog/speedy-browserifying-multiple-bundles/

// TODO: When in production, use '.min.js'

var _ = require('lodash');
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var path = require('path');
var argv = require('yargs').argv;
var arrayize = require('arrayize');

var production = argv.production || process.env.NODE_ENV === 'production';

// options for browserify which are required when using watchify
var watchifyOptions = {
  cache: {},
  packageCache: {},
  fullPaths: true
};

function _bundle(opts) {
  var src = opts.src || null;
  var dest = opts.dest;
  var dev = !production;
  var watch = dev;
  var debug = dev;
  var requires = opts.requires;
  var externals = opts.externals;
  if (!src && !requires) {
    throw "You must specify either a `src` or `requires`";
  }
  var destDirname = path.dirname(dest);
  var destBasename = path.basename(dest);
  var bundler = browserify(src, _.extend({debug: dev}, watchifyOptions));

  // Mark anything in externals as external so that it won't be compiled into
  // the bundle.
  arrayize(externals).forEach(function (external) {
    bundler.external(external);
  });

  // I believe this makes the modules inside available on the outside; however,
  // it does not make the module that was required in available. Only the ones
  // inside the module.
  arrayize(requires).forEach(function (module) {
    bundler.require(module, {expose: module});
  });

  function log(msg) {
    console.log(src + ': ' + msg);
  }
 
  if(watch) {
    log('watching');
    bundler = watchify(bundler);
    bundler.on('log', log);
  }
 
  // React transformations
  bundler.transform([reactify, {'es6': true}]);

  var rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', log); // error messages
    stream = stream.pipe(source(destBasename));
    if (production) {
      stream = stream.pipe(streamify(uglify()));
    }
    var returnValue = stream.pipe(gulp.dest(destDirname));
    return returnValue;
  };
 
  bundler.on('update', rebundle);

  rebundle();

  // console.log('bundler', bundler);

  return bundler;
}

function bundleLib(src, dest, externals) {
  return _bundle({
    requires: src,
    dest: dest,
    watch: true,
    externals: externals
  });
}

function bundle(src, dest, externals) {
  return _bundle({
    src: src,
    dest: dest,
    watch: true,
    externals: externals
  });
}

bundle.lib = bundleLib;

module.exports = bundle;