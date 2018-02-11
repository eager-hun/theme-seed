# Frontend seed

A boilerplate for styling and enhancing web pages.

Aims to include SASS/CSS, JS, SVG related assets and helpers, wrapped up with
a build setup.

Current build tool: primarily Gulp with livereload — and a Gulp task for
bundling things with Webpack.


## Installing and compiling

In `build-setup/gulp-webpack-hybrid/gulp-setup.js`, update the
paths.web.toGulpfile value to reflect your instance's actual path.

Then in cli:

    $ cd path/to/frontend-seed/
    $ npm install
    $ gulp compile


## Getting HTML

While HTML markup could very well be produced / managed within this project
using the the included Vue.js setup, a PHP option, the "[anypage][anypage]"
project has also been prepared. "Anypage" is a separate git repo, which aims to
provide a lightweight toolkit for producing and managing not only HTML markup,
but many aspects of a functioning website.

This project has been made a git submodule of the "[anypage][anypage]" project,
and the provided default configuration now assumes that this project is accessed
via "anypage" as a wrapper around it.


## Platform compatibility

I've seen this project work well on Ubuntu and MacOS platforms.

I however don't test on, and don't maintain any Windows compatibility, so it's
possible that the current composition of tooling doesn't play nice on Windows.


[anypage]: https://github.com/eager-hun/anypage
