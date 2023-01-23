/* ----------------------------------------------------------
  Compile styles
---------------------------------------------------------- */

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const stripCssComments = require('gulp-strip-css-comments');
const removeEmptyLines = require('gulp-remove-empty-lines');
const trimlines = require('gulp-trimlines');
const gulpStylelint = require('gulp-stylelint');
const replace = require('gulp-replace');

module.exports = function(sass_files, css_folder, bs) {
    return function intestarter_gulp_style() {
        return gulp.src(sass_files)
            .pipe(sassGlob())
            .pipe(sass({
                indentType: 'space',
                indentWidth: 0
            }).on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(stripCssComments({
                whitespace: false
            }))
            .pipe(removeEmptyLines())
            .pipe(trimlines())
            .pipe(replace(/( ?)([\,\:\{\}\;\>])( ?)/g, '$2'))
            .pipe(replace(';}', '}'))
            .pipe(gulp.dest(css_folder, {
                sourcemaps: false
            }))
            .pipe(bs.stream())
            .pipe(gulpStylelint({
                failAfterError: false,
                reporters: [{
                    formatter: 'string',
                    console: true
                }],
                debug: false
            }));
    };
};
