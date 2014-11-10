# gulp-react-bundle

This is a JavaScript build tool that compiles our JavaScript code into a single file.

It adds these featuers to the Browserify Bundle:

    * JSX
    * ES6
    * Source Maps

It is made for these features:

    * Automatic Watchify
    * External Libraries (that don't get compiled into other libraries)

## Installation

This will install thebundle from the github repo and save it into `package.json`.

```
npm install gulp-react-bundle --save-dev
```


## Usage

Create `gulpfile.js` in the root directory of your project.


```javascript
var gulp = require('gulp');
var bundle = require('gulp-react-bundle');

gulp.task('build', function() {
  bundle('./js/alpha.js', './build/alpha.js');
});

gulp.task('build-with-dependency', function() {
  var lib = bundle.lib(['lodash', 'jquery'], './build/alpha.js');
  bundle('./js/app.js', './build/app.js', lib);
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
  bundle('./js/alpha.js', './build/alpha.js');
})
```

## bundle(src, dest, externals)

`src` is the source file. Can be a String or an Array of Strings.

`dest` is the destination file. Must be a String.

`externals` (optional) are the externals or modules and libraries to exclude. These arguments can either be a String, a bundle object as returned from the method call to `bundle` or an Array (which contains String or bundle objects).

## bundle.lib(src, dest, externals)

Apart from externalizing the src files, `bundle.lib` works the same as bundle.


## Known Issues

* You must explicitly specify the modules in `bundle.lib`. You cannot assume that just because your source bundle requires another bundle, that the second bundle will automatically be exposed.

* The first time the bundle is created, the externals are not removed. This is a weird bug which I'll address later. In the meantime, the fact that additional rebundles in a watchify will happen MUCH faster is worth it.
