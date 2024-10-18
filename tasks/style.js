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
const fs = require('fs');
const Path = require('path');

module.exports = function(sass_files, css_folder, bs) {
    return function intestarter_gulp_style() {

        var sassOptions = {
            indentType: 'space',
            indentWidth: 0,
            silenceDeprecations: ['legacy-js-api'],
            functions: {
                'intestarter-gulp-inline-image($file)': function(_file) {
                    const filePath = Path.join(process.cwd(), _file.getValue());
                    const buffer = fs.readFileSync(filePath);
                    const ext = filePath.split('.').pop();
                    var data;
                    if(ext == 'svg') {
                        data = buffer.toString().replace(/[\n\r]/g, '');
                        data = data.replace(/"/g, "'");
                        data = data.replace(/\#/g, '%23');
                        data = 'url("data:image/svg+xml;utf8,' + data + '")';
                    }
                    else {
                        data = 'url("data:image/' + ext + ';base64,' + buffer.toString('base64') + '")';
                    }
                    _file.setValue(data)
                    return _file;
                }
            }
        }

        return gulp.src(sass_files)
            .pipe(sassGlob())
            .pipe(sass(sassOptions).on('error', sass.logError))
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
