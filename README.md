= Build

This is a JavaScript build tool for our proejects that works with gulp.

Create `gulpfile.js` in the root directory of your project.


```javascript
var gulp = require('gulp');
var bundle = require(...); // To be updated with the directory

gulp.task('default', function() {
  var alphaBundle = bundle('./js/alpha.js', './build/alpha.js');
  var bravoBundle = bundle('./js/bravo.js', './build/bravo.js', alphaBundle);
  var joinBundle = bundle(['./js/alpha.js', './js/bravo.js'], './build/join.js', alphaBundle);
});
```

The first arguments is the source file. Can be a String or an Array of String.

The second argument is the destination file. Must be a String.

The third argument, which is optional, are the externals or modules and libraries to exclude. These arguments can either be a String, a bundle object as returned from the method call to `bundle` or an Array (which contains String or bundle objects).