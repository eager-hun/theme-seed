
This directory works around NodeSass' attitude towards trying to include .css
files.

    DEPRECATION WARNING ...
    Including .css files with @import is non-standard behaviour which will be
    removed in future versions of LibSass. Use a custom importer to maintain
    this behaviour. Check your implementations documentation on how to create a
    custom importer.

See:

- https://github.com/sass/sass/issues/556
- https://www.bountysource.com/issues/395327-importing-css-as-sass-files
- and the `copy-in-css` gulp task in `./gulpfile.js`.

This is a .gitignored directory. The copied-in files will not show up in git
diffs.
