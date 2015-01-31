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
var colors = require('colors');

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
   // make these libs available outside the bundle
  var requires = opts.requires;
  // makes sure these libs are not included in the bundle (i.e. they are external)
  var externals = opts.externals; 
  if (!src && !requires) {
    throw "You must specify either a `src` or `requires`";
  }
  var destDirname = path.dirname(dest);
  var destBasename = path.basename(dest);
  var bundler = browserify(src, _.extend({debug: dev}, watchifyOptions));

  // External modules are not included in the current bundle.
  // We expect to find them in a separate bundle
  arrayize(externals).forEach(function (external) {
    bundler.external(external);
  });

  // Modules marked for require can be used outside this bundle.
  // To access them, they must be marked as external in the other bundle.
  arrayize(requires).forEach(function (module) {
    bundler.add(module);
    bundler.require(module, {expose: module});
  });

  function log(msg) {
    var from = (src !== null) ? src : requires.join(', ');
    console.log('-------------------------------------------------------------------------------'.grey);
    console.log(dest.yellow, (' (' + from + ')').green);
    console.log(msg);
  }
 
  // Watchify the bundle if watch is true
  if (watch) {
    bundler = watchify(bundler);
    bundler.on('log', log);
  }
 
  // Add React transformations including ES6 extensions
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

  // Call this once so that we have a rebundle happen upon first initialization
  rebundle();

  return bundler;
}

var bundle = function (src, dest, externals) {
  return _bundle({
    src: src,
    dest: dest,
    externals: externals
  });
}

bundle.lib = function (modules, dest) {
  return _bundle({
    requires: modules,
    dest: dest
  });
}

module.exports = bundle;