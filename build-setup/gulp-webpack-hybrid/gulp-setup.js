/**
 * @file
 * Setup values for gulpfile.js.
 */


// #############################################################################
// PATHS.
// NOTE: relative paths are relative from gulpfile.js' location!

const paths = {
  source: {
    // No trailing slash!
    frontendLibs: "libraries-frontend/node_modules",
    customLibs: "src/libs-custom",
    scss: "src/scss",
    customJs: "src/js-oldschool",
    svgSprite: "src/graphics/icons/svg"
  },
  output: {
    // No trailing slash!
    css: "assets-built/gulp-out/css",
    js: "assets-built/gulp-out/js",
    svgSprite: "assets-built/gulp-out/graphics/svg-sprite"
  },
  web: {
    // Use leading slash, but not trailing slash!
    // When used wrapped with the "anypage" project, with anypage's default
    // configuration.
    toGulpfile: "/themes/frontend-seed"
  },
  // No trailing slash!
  svgSpriteConfigs: "src/graphics/icons"
};


// #############################################################################
// OPTIONS.

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
      "sourceMappingURLPrefix": paths.web.toGulpfile + "/" + paths.output.css
    },
    js: {
      "sourceMappingURLPrefix": paths.web.toGulpfile + "/" + paths.output.js
    }
  },
  sass: {
    // Note that options from
    // https://github.com/sass/node-sass/blob/master/README.md may also apply.
    //
    // outputStyle's value will be finalized in the gulp task.
    outputStyle: {
      dev: "expanded",
      prod: "compressed",
    },
    // includePaths: [
    //   paths.source.frontendLibs + "/foo",
    // ]
  },
  autoprefixer: {
    // https://github.com/postcss/autoprefixer#options
    // https://github.com/ai/browserslist#queries
    browsers: ["last 2 versions", "ie >= 11", "and_chr >= 2.3"],
    flexbox: "no-2009",
    cascade: true
  },
  eslint: {
    useEslintrc: true,
    configFile: '.eslintrc'
  },
  uglify: {
    mangle: false
  },
  livereload: {
    start: true,
    quiet: true
  },
  reloadOn: {
    // NOTE: for pathsToWatch, use paths relative to gulpfile.js.
    css: {
      reloadEnabled: true,
      pathsToWatch: [
        // Path when used with the Anypage project.
        "../../app-assets/**/*.css"
      ]
    },
    html: {
      reloadEnabled: false,
      pathsToWatch: "**/*.html"
    },
    php: {
      reloadEnabled: true,
      pathsToWatch: [
        // Paths when used with the Anypage project.
        "../../../index.php",
        "../../../private/anypages/**/*.php",
        "../../../private/app/**/*.php",
        "../../../private/config/**/*.php"
      ]
    },
    twig: {
      reloadEnabled: true,
      // Path when used with the Anypage project.
      pathsToWatch: "../../../private/templates/**/*.twig"
    },
    svg: {
      reloadEnabled: true,
      pathsToWatch: "**/*.svg"
    },
    md: {
      reloadEnabled: true,
      pathsToWatch: [
        "README.md",
        // Paths when used with the Anypage project.
        "../../../private/anypages/**/*.md",
        "../../../README.md"
      ]
    }
  },
  svgSprite: {
    // dest: "foobar-dir",
    // log: "debug",
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false,
      dimensionAttributes: false,
      namespaceIDs: true,
      namespaceClassnames: true,
    },
    shape: {
      // Does not seem to have effect on symbol mode:
      // dimension: { maxWidth: 32, maxHeight: 32 },
      // spacing: { padding: 1, box: "icon" },

      align: paths.svgSpriteConfigs + "/svg-sprite-alignment.yaml",
      transform: [
        {"svgo": {}}
      ],
      id: {
        separator: "__",
      }
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
        inline: true,
        bust: false,
        example: {
          dest: "svg-sprite.symbol-mode.inventory.html"
        }
      }
    }
  }
};


// #############################################################################
// JS BUNDLE DEFINITIONS - the oldschool (pre-module-bundling) way.

const jsOldschoolBundles = {
  libs: {
    outFileName: "libs",
    files: [
      // paths.source.frontendLibs + "/foo.min.js"
    ],
    lint: false,
    babel: false,
    minifyOnBuild: false,
  },
  styleguide: {
    outFileName: "styleguide",
    files: [
      paths.source.frontendLibs + "/prismjs/prism.js"
    ],
    lint: false,
    babel: false,
    minifyOnBuild: true,
  },
  custom: {
    outFileName: "custom",
    files: [
      paths.source.customJs + "/svg-sprite-ajax.js",
      paths.source.customJs + "/custom-script-1.js",
      paths.source.customJs + "/custom-script-2.js"
    ],
    lint: true,
    babel: true,
    minifyOnBuild: true,
  }
};


// #############################################################################
// EXPORT.

module.exports = {
  paths,
  options,
  jsOldschoolBundles
};
