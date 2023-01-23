/* ----------------------------------------------------------
  Lint JS files
---------------------------------------------------------- */

const gulp = require('gulp');
const jshint = require('gulp-jshint');

module.exports = function(js_src_files) {
    return function intestarter_gulp_lintjs() {
        return gulp.src(js_src_files)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    };
};
