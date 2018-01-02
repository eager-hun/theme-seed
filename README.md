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


## Note if you are new to Node.js and NPM

- Learn their specific procedures on your operating system. E.g.:
    - you will not want to get stuck with your `node_modules` directories on
      Windows machines; see: http://stackoverflow.com/q/28175200


[anypage]: https://github.com/eager-hun/anypage

