var gulp = require('gulp');

var neat = require('node-neat');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var neat = require('node-neat');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');

 
// run localhost:8080 server for build 
gulp.task('connect', function () {
  connect.server({
    root: 'build',
    port: 8080
  });
});

// minfiy html files and send them to build folder
gulp.task('html', function(){
  return gulp.src('app/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('build'));
});

gulp.task('html-partials', function(){
  return gulp.src('app/components/**/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('build/components'));
});

// send vendor js files to build
gulp.task('vendor', function() {
  return gulp.src('./app/assets/libs/**/*')
    .pipe(gulp.dest('build/assets/libs'));
});

// combine and minify js files
gulp.task('scripts', function() {
  return gulp.src(['./app/app.js', './app/components/**/*.js', './app/directives/**/*.js', './app/js/*.js', './app/filters/*.js'])
    .pipe(concat('app.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('build'));
});

// Styles build task, concatenates all the files
gulp.task('styles', function() {
  return gulp.src('./app/assets/scss/*.scss')
    .pipe(sass({
      includePaths: require('node-neat').with('./app/assets/libs/mdi/scss')
    }))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/assets/css'));
});

gulp.task('copyFonts', function(){
  return gulp.src('./app/assets/fonts/*')
    .pipe(gulp.dest('build/assets/fonts'));
});

gulp.task('copyDirectiveHtml', function(){
  return gulp.src('./app/directives/*.html')
    .pipe(gulp.dest('build/directives'));
});

// JavaScript linting task
gulp.task('jshint', function() {
  return gulp.src(['./app/app.js', './app/components/**/*.js', './app/directives/**/*.js', './app/filters/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('./app/**/*.html', ['build'] );
  gulp.watch(['./app/app.js', './app/components/**/*.js', './app/directives/**/*.js', './app/js/*.js'], ['build']);
  gulp.watch('./app/assets/scss/*.scss', ['build']);
  gulp.watch('./build/assets/img/**/*', ['build']);
});

gulp.task('default', ['connect', 'watch', 'jshint']);

gulp.task('build', ['html', 'html-partials', 'vendor', 'scripts', 'jshint', 'styles', 'copyFonts', 'copyDirectiveHtml']);
