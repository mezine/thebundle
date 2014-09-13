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

var production = argv.production || process.env.NODE_ENV === 'production';

function bundleWithOpts(opts) {
  var src = opts.src || null;
  var dest = opts.dest;
  var dev = !production;
  var watch = dev;
  var debug = dev;
  var requires = opts.requires || [];
  var externals = opts.externals || [];
  if (!src && requires.length === 0) {
    throw "You must specify either a .src or an array in .requires";
  }
  var destDirname = path.dirname(dest);
  var destBasename = path.basename(dest);
  var bundler, rebundle;
  bundler = browserify(src, {
    // basedir: __dirname, 
    debug: dev, 
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });

  // Mark anything in externals as external so that it won't be compiled into
  // the bundle.

  if (!_.isArray(externals)) {
    externals = [externals];
  }
  externals.forEach(function (external) {
    bundler.external(external);
  });

  // Force a require
  requires.forEach(function (module) {
    bundler.require(module);
  });

  function log(msg) {
    console.log(src + ': ' + msg);
  }
 
  if(watch) {
    log('watching');
    bundler = watchify(bundler);
    bundler.on('log', log);
  }
 
  bundler.transform([reactify, {'es6': true}]);

  rebundle = function() {
    var stream = bundler.bundle();
    // outputs error message to the console.
    stream.on('error', log);
    stream = stream.pipe(source(destBasename));
    if (production) {
      stream = stream.pipe(streamify(uglify()));
    }
    return stream.pipe(gulp.dest(destDirname));
  };
 
  bundler.on('update', rebundle);

  rebundle();

  // console.log('bundler', bundler);

  return bundler;
}

function bundleScripts(src, dest, externals) {
  return bundleWithOpts({
    src: src,
    dest: dest,
    watch: true,
    externals: externals
  });
}

function bundle(src, dest, libs) {
  return bundleScripts(src, dest, libs);
}

module.exports = bundle;