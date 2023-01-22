/* ----------------------------------------------------------
  Concat & minify js files
---------------------------------------------------------- */

const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require("gulp-minify");
const replace = require('gulp-replace');

module.exports = function(js_src_files, js_folder) {
    return function intestarter_gulp_minifyjs() {
        return gulp.src(js_src_files, {
                allowEmpty: true
            })
            .pipe(minify({
                noSource: true
            }))
            .pipe(concat('app.js', {
                newLine: ";\n"
            }))
            .pipe(replace(/;\n;/g, ';;'))
            .pipe(replace(/;+/g, ';'))
            .pipe(replace(";\n;", ';'))
            .pipe(gulp.dest(js_folder));
    };
};
