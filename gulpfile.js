var gulp = require('gulp');
var bundle = require('./bundle');

gulp.task('default', function() {
  var reactBundle = bundle('./js/react.js', './build/react.js');
  var alphaBundle = bundle('./js/alpha.js', './build/alpha.js');
  var bravoBundle = bundle('./js/bravo.js', './build/bravo.js', alphaBundle);
  var joinBundle = bundle(['./js/alpha.js', './js/bravo.js'], './build/join.js', alphaBundle);
});


gulp.task('group', function () {
  // var lib = bundle.lib('./js/lib.js', './build/lib.js');
  var lib = bundle.lib(['lodash', 'jquery', 'bluebird'], './build/group-lib.js');
  var app = bundle('./js/group-app.js', './build/group-app.js', lib);
  // var xlib = bundle('lodash', './build/lib.js');
  // var xapp = bundle('./js/app.js', './build/xapp.js', xlib);
});