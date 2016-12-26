# Theme seed

A boilerplate for styling and enhancing web pages.

Aims to include Sass/CSS, JS, then later SVG, and bitmap image related assets
and helpers, wrapped up with a build setup.

Current build tool: Gulp with livereload.

**Note:**

This project has been made a submodule of the "[anypage][anypage]" project, and
the provided default configuration now assumes that this project is accessed
via "anypage" as a wrapper around it.

Sample contents can be accessed and developed by using this project together
with the "anypage" project.

## Installing external packages and compiling assets

In `gulpfile.js`, update the `paths` (`web`) and `options` (`livereload`)
values to reflect your instance's actual paths and domain name scenario.

Then in cli:

    $ cd path/to/theme-seed/
    $ npm install
    $ gulp compile

## If you are new to node.js and npm:

- Learn their specific procedures on your operating system. E.g.:
    - you will not want to get stuck with your `node_modules` directories on
      Windows machines; see: http://stackoverflow.com/q/28175200

[anypage]: https://github.com/eager-hun/anypage

