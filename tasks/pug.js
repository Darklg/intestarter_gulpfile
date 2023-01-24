/* ----------------------------------------------------------
  Generate styleguide
---------------------------------------------------------- */

const gulp = require('gulp');
const replace = require('gulp-replace');
const pug = require('gulp-pug');
const glob = require('glob');

module.exports = function(p, pug_views, pug_files, svg_files, js_folder, css_folder) {
    return function intestarter_gulp_pug() {
    'use strict';

        /* List icons */
        var _icons = glob.sync(svg_files).map(function(item) {
            return item.split('/').reverse()[0].replace('.svg', '');
        });

        return gulp
            .src([pug_views + '*.pug'])
            .pipe(pug({
                locals: {
                    icons: _icons,
                    jsFiles: glob.sync(js_folder + '/*.js'),
                    cssFiles: glob.sync(css_folder + '/*.css'),
                    package: p
                },
                doctype: 'html',
                pretty: false
            }))
            .pipe(gulp.dest('./'));
    };
};
