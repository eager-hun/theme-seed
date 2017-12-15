
// #############################################################################
// GULP WIRING.

// -----------------------------------------------------------------------------
// PLUGINS.

const gulp                  = require("gulp");
const del                   = require('del');
const sourcemaps            = require('gulp-sourcemaps');
const sass                  = require('gulp-sass');
const autoprefixer          = require('gulp-autoprefixer');
const livereload            = require('gulp-livereload');
const gulpif                = require('gulp-if');
const uglify                = require('gulp-uglify');
const rename                = require('gulp-rename');
const concat                = require('gulp-concat');
const jshint                = require('gulp-jshint');
const svgsprite             = require('gulp-svg-sprite');
const plumber               = require('gulp-plumber');
const webpack               = require("webpack");
const webpackStream         = require("webpack-stream");

// -----------------------------------------------------------------------------
// SETUP.

const setup                 = require("./build-setup/gulp-webpack-hybrid/gulp-setup");

const paths                 = setup.paths;
const options               = setup.options;
const jsOldschoolBundles    = setup.jsOldschoolBundles;

const webpackConfig         = require("./build-setup/gulp-webpack-hybrid/webpack-config");


// #############################################################################
// TASKS TO BE CALLED FROM THE CLI.

gulp.task('default', ['watch']);

gulp.task('watch', ['compile', 'watchers']);

gulp.task('compile', [
    'compile-svg-sprites',
    'compile-scss',
    'compile-js-libs',
    'compile-custom-js',
    'compile-styleguide-js',
    'webpack'
]);


// #############################################################################
// HELPER FUNCTIONS AND TASKS.

const plumberErrorHandler = function(err) {
    console.log(err);
};

// -----------------------------------------------------------------------------
// Cleaning up old files before saving new ones.

const announceCleaning = function (paths) {
  if (paths.length > 0) {
    if (options.cleaning.delOpts.dryrun) {
      console.log('Files and folders that would be deleted:');
      console.log(paths.join('\n'));
    }
    else if (options.cleaning.verbose) {
      console.log('Deleted files and folders:');
      console.log(paths.join('\n'));
    }
  }
};

const cleanBuiltJsBundle = function (bundleName) {
  if (options.cleaning.enabled) {
    const globs = [
      paths.output.js + '/' + jsOldschoolBundles[bundleName].filename + '.js',
      paths.output.js + '/' + jsOldschoolBundles[bundleName].filename + '.min.js',
      paths.output.js + '/sourcemaps/' + jsOldschoolBundles[bundleName].filename + '.js.map',
      paths.output.js + '/sourcemaps/' + jsOldschoolBundles[bundleName].filename + '.min.js.map'
    ];
    del(globs, options.cleaning.delOpts)
      .then(announceCleaning);
  }
};

gulp.task('clean-css', function () {
  if (options.cleaning.enabled) {
    del([paths.output.css + '/*'], options.cleaning.delOpts)
      .then(announceCleaning);
  }
});

gulp.task('clean-js-libs', function () {
  cleanBuiltJsBundle('libs');
});

gulp.task('clean-custom-js', function () {
  cleanBuiltJsBundle('custom');
});

gulp.task('clean-styleguide-js', function () {
  cleanBuiltJsBundle('styleguide');
});


// #############################################################################
// BUILD FUNCTIONS AND TASKS.

// -----------------------------------------------------------------------------
// COMPILING SCSS.

gulp.task('compile-scss', ['clean-css'], function () {
  return gulp.src(paths.source.scss + '/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(options.sass)
      .on('error', sass.logError))
    .pipe(autoprefixer(options.autoprefixer))
    .pipe(sourcemaps.write('./sourcemaps', options.sourcemaps.sass))
    .pipe(gulp.dest(paths.output.css))
    .pipe(livereload());
});

// -----------------------------------------------------------------------------
// COMPILING JS BUNDLES.

// NOTE: there is a watcher set up only for the "custom" js bundle; if you add
// or remove libraries, you need to relaunch gulp.

const compileJsBundle = function (bundleName) {
  let doJsHinting  = false;
  let doLivereload = false;

  if (bundleName === 'custom') {
    doJsHinting  = true;
    doLivereload = true;
  }

  // Do we need to check for files' length (if they exist) first?
  return gulp.src(jsOldschoolBundles[bundleName].files)
    .pipe(plumber({errorHandler: plumberErrorHandler}))
    .pipe(gulpif(doJsHinting, jshint()))
    .pipe(gulpif(doJsHinting, jshint.reporter('default')))
    .pipe(sourcemaps.init())
    .pipe(concat(jsOldschoolBundles[bundleName].filename + '.js', {newLine: "\n;"}))
    .pipe(gulp.dest(paths.output.js))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify(options.uglify))
    .pipe(sourcemaps.write('./sourcemaps', options.sourcemaps.js))
    .pipe(gulp.dest(paths.output.js))
    .pipe(gulpif(doLivereload, livereload()));
};

gulp.task('compile-js-libs', ['clean-js-libs'], function() {
  return compileJsBundle('libs');
});

gulp.task('compile-custom-js', ['clean-custom-js'], function() {
  return compileJsBundle('custom');
});

gulp.task('compile-styleguide-js', ['clean-styleguide-js'], function() {
  return compileJsBundle('styleguide');
});

// -----------------------------------------------------------------------------
// BUILDING SVG SPRITE(s).

// NOTE: in the case of the SVG sprite generator, trying to clean previously
// built files in the same fashion as they are pre-cleaned in the case of .css
// and .js files, the deletion of the old files doesn't happen properly: it
// seems to execute async, it feels race-conditiony, and sometimes deletes the
// freshly created files. So it's not implemented.

gulp.task('compile-svg-sprites', function() {
    return gulp.src(paths.source.svgSprite + '/*.svg')
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe(svgsprite(options.svgSprite))
        .pipe(gulp.dest(paths.output.svgSprite))
        .pipe(livereload());
});

// -----------------------------------------------------------------------------
// WEBPACK.

gulp.task('webpack', function() {
    // If this task was invoked via the Gulp 'watch' task, let's ask webpack to
    // watch, too.
    if ("seq" in this && this.seq.includes('watch')) {
        webpackConfig.watch = true;
    }

    return gulp.src(webpackConfig.entry.index)
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(webpackConfig.output.path))
        .pipe(livereload());
});

// -----------------------------------------------------------------------------
// WATCHERS.

const watcherAnnounce = function watcherAnnounce(event) {
  console.log('File ' + event.type + ":\n" + event.path);
};

gulp.task('watchers', function() {
  livereload.listen(options.livereload);

  gulp.watch(paths.source.scss      + '/**/*.scss', ['compile-scss']);
  gulp.watch(paths.source.customJs  + '/**/*.js',   ['compile-custom-js']);
  gulp.watch(paths.source.svgSprite + '/**/*.svg',  ['compile-svg-sprites']);

  // Extra watchers for various filetypes.
  for (let fileExtension in options.reloadOn) {
    if (options.reloadOn.hasOwnProperty(fileExtension)
        && options.reloadOn[fileExtension].reloadEnabled) {
      console.log(
        'Extra watcher + livereload is enabled for filetype: .' + fileExtension
      );
      gulp.watch(options.reloadOn[fileExtension].pathsToWatch)
        .on('change', function(event) {
          watcherAnnounce(event);
          livereload.reload();
        });
    }
  }
});
