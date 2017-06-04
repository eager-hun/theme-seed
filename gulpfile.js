/**
 * @file
 * gulpfile.js for theme-seed.
 */

/*
NOTES:

  Docs:
    https://github.com/gulpjs/gulp/blob/master/docs/API.md
    https://github.com/gulpjs/gulp/tree/master/docs/recipes

  Overviews:
    http://andy-carter.com/blog/a-beginners-guide-to-the-task-runner-gulp
    https://markgoodyear.com/2014/01/getting-started-with-gulp/
    http://www.chenhuijing.com/blog/drupal-101-theming-with-gulp/

  On concatenating files:
    Gulp minify multiple js files to one
      http://stackoverflow.com/a/26719941
    Using Gulp to Concatenate and Uglify files
      http://stackoverflow.com/a/24597914

  On sourcemaps:
    https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support

  On livereload:
    https://www.npmjs.com/package/gulp-livereload
*/


// #############################################################################
// Gulp wiring.

var gulp         = require('gulp');
var del          = require('del');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var livereload   = require('gulp-livereload');
var gulpif       = require('gulp-if');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var jshint       = require('gulp-jshint');
var plumber      = require('gulp-plumber');


// #############################################################################
// Project setup.

// -----------------------------------------------------------------------------
// Paths.

var paths = {
  web: {
    // Use leading slash, but not trailing slash!

    // When used wrapped with the "anypage" project.
    toDocroot:  '/anypage/',
    toGulpfile: '/anypage/themes/theme-seed'

    // When used standalone
    // (but still accessed via an Apache or Nginx server's virtual host).
    // toDocRoot:  '/theme-seed',
    // toGulpfile: '/theme-seed'
  },
  source: {
    // Paths relative to the gulpfile. No trailing slash!
    frontendLibs: 'libraries-frontend/node_modules',
    customLibs:   'src/libs-custom',
    scss:         'src/scss',
    customJs:     'src/js'
  },
  output: {
    // Paths relative to the gulpfile. No trailing slash!
    css:        'build/css',
    js:         'build/js'
  }
};

// -----------------------------------------------------------------------------
// Options.

var options = {
  // Cleaning deletes earlier instances of built files before writing new ones.
  cleaning: {
    enabled: true,
    verbose: false,
    delOpts: {
      dryrun: false
    }
  },
  sourcemaps: {
    sass: {
      'sourceMappingURLPrefix': paths.web.toGulpfile + '/' + paths.output.css
    },
    js: {
      'sourceMappingURLPrefix': paths.web.toGulpfile + '/' + paths.output.js
    }
  },
  sass: {
    // Note that options from
    // https://github.com/sass/node-sass/blob/master/README.md may also apply.
    //
    // See https://web-design-weekly.com/2014/06/15/different-sass-output-styles/
    // nested || expanded || compact || compressed
    outputStyle: 'expanded',
    includePaths: [
      paths.source.frontendLibs + '/normalize.css',
      paths.source.frontendLibs + '/foundation-lean-grid/scss',
      paths.source.frontendLibs + '/prismjs/themes'
    ]
  },
  autoprefixer: {
    // https://github.com/postcss/autoprefixer#options
    // https://github.com/ai/browserslist#queries
    browsers: ['last 2 versions', 'ie >= 10', 'and_chr >= 2.3'],
    flexbox:  'no-2009',
    cascade:  true
  },
  uglify: {
    mangle: false
  },
  livereload: {
    start:      true,
    quiet:      true
    // ? (For me, it appears to be working without specifying `reloadPage`.)
    // reloadPage: 'http://your-local-instances-domain' + paths.web.toDocRoot,
  },
  reloadOn: {
    // NOTE: for pathToWatch, use a path relative to the gulpfile.js.
    css: {
      // Path when used with the Anypage project.
      reloadEnabled: true,
      pathToWatch:   '../../**/*.css'
    },
    html: {
      reloadEnabled: false,
      pathToWatch:   '**/*.html'
    },
    php: {
      reloadEnabled: true,
      // Path when used with the Anypage project.
      pathToWatch:   '../../../**/*.php'
    },
    twig: {
      reloadEnabled: true,
      // Path when used with the Anypage project.
      pathToWatch:   '../../../private/anypages/templates/**/*.twig'
    },
    svg: {
      reloadEnabled: false,
      pathToWatch:   '**/*.svg'
    }
  }
};


// #############################################################################
// Js bundle definitions.

var jsBundles = {
  libs: {
    filename: 'libs'
  },
  styleguide: {
    filename: 'styleguide'
  },
  custom: {
    filename: 'custom'
  }
};

// -----------------------------------------------------------------------------
// Libraries' bundle.

jsBundles.libs.files = [
  paths.source.frontendLibs + '/jquery/dist/jquery.js'
];

// -----------------------------------------------------------------------------
// Custom JS files' bundle.

jsBundles.custom.files = [
  paths.source.customJs + '/custom-script-1.js',
  paths.source.customJs + '/custom-script-2.js'
];

// -----------------------------------------------------------------------------
// Bundle of JS files that are needed only by the styleguide.

jsBundles.styleguide.files = [
  paths.source.frontendLibs + '/prismjs/prism.js'
];


// #############################################################################
// Helper tasks.

// -----------------------------------------------------------------------------
// Cleaning up old files before saving new ones.

var announceCleaning = function (paths) {
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

var cleanBuiltJsBundle = function (bundleName) {
  if (options.cleaning.enabled) {
    var globs = [
      paths.output.js + '/' + jsBundles[bundleName].filename + '.js',
      paths.output.js + '/' + jsBundles[bundleName].filename + '.min.js',
      paths.output.js + '/sourcemaps/' + jsBundles[bundleName].filename + '.js.map',
      paths.output.js + '/sourcemaps/' + jsBundles[bundleName].filename + '.min.js.map'
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
// Build tasks.

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

var compileJsBundle = function (bundleName) {
  var doJsHinting  = false;
  var doLivereload = false;

  if (bundleName === 'custom') {
    doJsHinting  = true;
    doLivereload = true;
  }

  // Do we need to check for files' length (if they exist) first?
  return gulp.src(jsBundles[bundleName].files)
    .pipe(gulpif(doJsHinting, jshint()))
    .pipe(gulpif(doJsHinting, jshint.reporter('default')))
    .pipe(sourcemaps.init())
    .pipe(concat(jsBundles[bundleName].filename + '.js', {newLine: "\n;"}))
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
// WATCHERS.

var watcherAnnounce = function watcherAnnounce(event) {
  console.log('File ' + event.type + ":\n" + event.path);
};

gulp.task('watchers', function() {
  livereload.listen(options.livereload);

  gulp.watch(paths.source.scss     + '/**/*.scss', ['compile-scss']);
  gulp.watch(paths.source.customJs + '/**/*.js',   ['compile-custom-js']);

  // Extra watchers for various filetypes.
  for (var fileExtension in options.reloadOn) {
    if (options.reloadOn.hasOwnProperty(fileExtension)
        && options.reloadOn[fileExtension].reloadEnabled) {
      console.log(
        'Extra watcher + livereload is enabled for filetype: .' + fileExtension
      );
      gulp.watch(options.reloadOn[fileExtension].pathToWatch)
        .on('change', function(event) {
          watcherAnnounce(event);
          livereload.reload();
        });
    }
  }
});


// #############################################################################
// Tasks to be called from the cli.

gulp.task('compile', [
  'compile-scss',
  'compile-js-libs',
  'compile-custom-js',
  'compile-styleguide-js'
]);

gulp.task('watch', ['compile', 'watchers']);

gulp.task('default', ['watch']);

