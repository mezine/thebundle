var gulp = require('gulp');
var bundle = require('./bundle');

gulp.task('default', function() {
  var reactBundle = bundle('./js/react.js', './build/react.js');
  var alphaBundle = bundle('./js/alpha.js', './build/alpha.js');
  var bravoBundle = bundle('./js/bravo.js', './build/bravo.js', alphaBundle);
  var joinBundle = bundle(['./js/alpha.js', './js/bravo.js'], './build/join.js', alphaBundle);
});