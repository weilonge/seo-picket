'use strict';

var gulp = require('gulp');
var gutil = require('gutil');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

const TEST_PATH = 'test/*_test.js';

gulp.task('unit-test', gulp.series(() => {
  return gulp.src([TEST_PATH], {read: false})
    .pipe(mocha({reporter: 'list'})).on('error', gutil.log);
}));

gulp.task('test', gulp.series('unit-test'));

gulp.task('default', gulp.series('test'));

gulp.task('lint', gulp.series(() => {
  return gulp.src(['**/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}));

