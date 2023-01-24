/* ----------------------------------------------------------
  Build icon font
---------------------------------------------------------- */

const gulp = require('gulp');
const {
    series
} = gulp;
const replace = require('gulp-replace');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const svgmin = require('gulp-svgmin');
const runTimestamp = function() {
    return Math.round(Date.now() / 1000);
};
const Vinyl = require('vinyl');

module.exports = function(svg_files, sass_folder_proj, fonts_folder, fontName) {
    'use strict';
    var buildiconfont = function () {
        var _ts = runTimestamp();
        return gulp.src([svg_files])
            .pipe(svgmin())
            .pipe(iconfontCss({
                cssClass: 'icon',
                fontName: fontName,
                targetPath: '../../../' + sass_folder_proj + '/_icons.scss',
                path: 'css',
                cacheBuster: _ts,
                fontPath: '../../' + fonts_folder + '/' + fontName + '/'
            }))
            .pipe(iconfont({
                normalize: true,
                fontName: fontName,
                fontHeight: 1001,
                formats: ['ttf', 'eot', 'woff', 'woff2'],
            }))
            .pipe(gulp.dest(fonts_folder + '/' + fontName + '/'))
            .on("finish", function() {
                /* Create version file */
                build_file_from_string("version.txt", '' + _ts)
                    .pipe(gulp.dest(fonts_folder + '/' + fontName + '/'));
            });
    };

    var fixiconfont = function () {
        /* Correct dir & prefix */
        return gulp.src(sass_folder_proj + '/_icons.scss', {
                base: "./"
            })
            .pipe(replace('icon-', 'icon_'))
            .pipe(gulp.dest('./'));
    };

    var build_file_from_string = function (filename, string) {
        var src = require('stream').Readable({
            objectMode: true
        });
        src._read = function() {
            this.push(new Vinyl({
                cwd: "",
                path: filename,
                contents: Buffer.from(string, 'utf-8')
            }));
            this.push(null);
        };
        return src;
    };

    return series(buildiconfont, fixiconfont);
};
