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
  livereload: {
    start:      true,
    quiet:      true
    // ? (For me, it appears to be working without specifying `reloadPage`.)
    // reloadPage: 'http://your-local-instances-domain' + paths.web.toDocRoot,
  },
  reloadOn: {
    // NOTE: for pathToWatch, use a path relative to the gulpfile.js.
    css: {
      reloadEnabled: true,
      pathToWatch:   'static-assets/**/*.css'
    },
    html: {
      reloadEnabled: true,
      pathToWatch:   '**/*.html'
    },
    php: {
      reloadEnabled: true,
      // Path when used with Anypage project.
      pathToWatch:   '../../**/*.php'
    },
    twig: {
      reloadEnabled: true,
      // Path when used with Anypage project.
      pathToWatch:   '../../anypages/templates/**/*.twig'
    },
    svg: {
      reloadEnabled: false,
      pathToWatch:   '**/*.svg'
    }
  }
};


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

gulp.task('clean-css', function () {
  if (options.cleaning.enabled) {
    del([paths.output.css + '/*'], options.cleaning.delOpts)
      .then(announceCleaning);
  }
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
// WATCHERS.

var watcherAnnounce = function watcherAnnounce(event) {
  console.log('File ' + event.type + ":\n" + event.path);
};

gulp.task('watchers', function() {
  livereload.listen(options.livereload);

  gulp.watch(paths.source.scss + '/**/*.scss', ['compile-scss']);

  // Extra watchers for various filetypes.
  for (fileExtension in options.reloadOn) {
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

gulp.task('compile', ['compile-scss']);

gulp.task('watch', ['compile', 'watchers']);

gulp.task('default', ['watch']);

