/**
 * @file
 * Setup values for gulpfile.js.
 */


// -----------------------------------------------------------------------------
// PATHS.
// NOTE: relative paths are relative from gulpfile.js' location.

const paths = {
    source: {
        // Paths relative to the gulpfile. No trailing slash!
        frontendLibs: 'libraries-frontend/node_modules',
        customLibs:   'src/libs-custom',
        scss:         'src/scss',
        customJs:     'src/js',
        svgSprite:    'src/graphics/icons/svg'
    },
    output: {
        // Paths relative to the gulpfile. No trailing slash!
        css:        'build/css',
        js:         'build/js',
        svgSprite:  'build/graphics/svg-sprite'
    },
    web: {
        // Use leading slash, but not trailing slash!
        // When used wrapped with the "anypage" project.
        toGulpfile: '/anypage/public/themes/theme-seed'
    },
    // Path relative to the gulpfile. No trailing slash!
    svgSpriteConfigs: 'src/graphics/icons'
};


// -----------------------------------------------------------------------------
// Options.

const options = {
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
            paths.source.frontendLibs + '/prismjs/themes'
        ]
    },
    autoprefixer: {
        // https://github.com/postcss/autoprefixer#options
        // https://github.com/ai/browserslist#queries
        browsers: ['last 2 versions', 'ie >= 11', 'and_chr >= 2.3'],
        flexbox:  'no-2009',
        cascade:  true
    },
    uglify: {
        mangle: false
    },
    livereload: {
        start: true,
        quiet: true
    },
    reloadOn: {
        // NOTE: for pathToWatch, use a path relative to gulpfile.js.
        css: {
            reloadEnabled: true,
            pathToWatch: [
                '../../app-assets/**/*.css' // Path when used with the Anypage project.
            ]
        },
        html: {
            reloadEnabled: false,
            pathToWatch:   '**/*.html'
        },
        php: {
            reloadEnabled: true,
            // Paths when used with the Anypage project.
            pathToWatch: [
                '../../../index.php',
                '../../../private/anypages/**/*.php',
                '../../../private/app/**/*.php',
                '../../../private/config/**/*.php'
            ]
        },
        twig: {
            reloadEnabled: true,
            // Path when used with the Anypage project.
            pathToWatch:   '../../../private/anypages/templates/**/*.twig'
        },
        svg: {
            reloadEnabled: false,
            pathToWatch:   '**/*.svg'
        },
        md: {
            reloadEnabled: true,
            // Path when used with the Anypage project.
            pathToWatch:   '../../../private/anypages/**/*.md'
        }
    },
    // See http://jkphl.github.io/svg-sprite/#gulp
    // See https://github.com/jkphl/gulp-svg-sprite#examples
    // See https://github.com/jkphl/svg-sprite#configuration-basics
    // See https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md
    // See https://caniuse.com/#search=SVG
    // See https://css-tricks.com/svg-sprites-use-better-icon-fonts/
    // See https://css-tricks.com/svg-use-with-external-reference-take-2/
    // See https://css-tricks.com/ajaxing-svg-sprite/
    // See https://css-tricks.com/svg-symbol-good-choice-icons/
    // See https://css-tricks.com/svg-fragment-identifiers-work/
    // See https://codepen.io/chriscoyier/pen/GndhE
    // See https://developer.paciellogroup.com/blog/2013/12/using-aria-enhance-svg-accessibility/
    // See https://github.com/jonathantneal/svg4everybody
    // see https://github.com/jonathantneal/svg4everybody#readability-and-accessibility
    svgSprite: {
        // dest: "foobar-dir",
        // log: "debug",
        svg: {
            xmlDeclaration: false,
            doctypeDeclaration: false,
            dimensionAttributes: true,
            namespaceIDs: true
        },
        shape: {
            dimension: { maxWidth: 32, maxHeight: 32 },
            spacing: { padding: 1, box: 'icon' },
            align: paths.svgSpriteConfigs + '/svg-sprite-alignment.yaml',
            meta: paths.svgSpriteConfigs + '/svg-sprite-meta.yaml',
            transform: [
                {'svgo': {}}
            ],
        },
        mode: {
            css: {
                dest: ".",
                sprite: "svg-sprite.css-mode.svg",
                common: "svg-icon-sprite",
                prefix: "svg-icon-sprite__%s",
                layout: "vertical", // "vertical", "horizontal", "diagonal" or "packed"
                render: {
                    css: false
                    // css: { dest: "svg-sprite.css-mode.stylesheet.css" }
                },
                bust: false,
                example: {
                    dest: "svg-sprite.css-mode.inventory.html"
                }
            },
            symbol: {
                dest: ".",
                sprite: "svg-sprite.symbol-mode.svg",
                prefix: "svg-icon-sprite__%s",
                inline: true,
                bust: false
            }
        }
    }
};


// -----------------------------------------------------------------------------
// Js bundle definitions.

const jsBundles = {
    libs: {
        filename: 'libs',
        files: [
            paths.source.frontendLibs + '/jquery/dist/jquery.js'
        ]
    },
    styleguide: {
        filename: 'styleguide',
        files: [
            paths.source.frontendLibs + '/prismjs/prism.js'
        ]
    },
    custom: {
        filename: 'custom',
        files: [
            paths.source.customJs + '/svg-sprite-ajax.js',
            paths.source.customJs + '/custom-script-1.js',
            paths.source.customJs + '/custom-script-2.js'
        ]
    }
};


// #############################################################################
// EXPORT.

module.exports = {
    paths,
    options,
    jsBundles
};
