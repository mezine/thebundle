# thebundle

This is a JavaScript build tool for our proejects that works with gulp.

## Installation

This will install thebundle from the github repo and save it into `package.json`.

```
npm install git://github.com/mezine/thebundle.git --save-dev
```

Note `npm update` won't work.

Instead, add the git hash to the module location in `package.json`. I only used the first 8 characters of the hash here which works fine. You can find the hash in the github repo by clicking on the `x commits` text near the top of the repo.

```javascript
{
  // ...
  "devDependencies": {
    "thebundle": "git://github.com/mezine/thebundle.git#c462c730"
  }
}
```

Then use `npm install` and it will work.

## Usage

Create `gulpfile.js` in the root directory of your project.


```javascript
var gulp = require('gulp');
var bundle = require('thebundle');

gulp.task('build', function() {
  var aBundle = bundle('./js/alpha.js', './build/alpha.js');
  var bBundle = bundle('./js/bravo.js', './build/bravo.js', aBundle);
  var joinBundle = bundle(['./js/alpha.js', './js/bravo.js'], './build/join.js', aBundle);
});
```

To build

```
gulp build
```

To build for production

```
gulp build --production
```


### Hint

To make it the default task, just name the gulp task default.

```javascript
gulp.task('default', function () {
  // code goes here
})
```

## bundle(src, dest, externals)

`src` is the source file. Can be a String or an Array of String.

`dest` is the destination file. Must be a String.

`externals` (optional) are the externals or modules and libraries to exclude. These arguments can either be a String, a bundle object as returned from the method call to `bundle` or an Array (which contains String or bundle objects).