"use strict";

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task("babel_build", function () {
    return gulp.src("src/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('babel_watch', function() {
    gulp.watch('src/**/*.js', ['babel_build'])
});

gulp.task('default', ['babel_build', 'babel_watch']);
