// gulp packages
var gulp  = require('gulp'),
	  concat = require('gulp-concat'),
	  connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    gutil = require('gulp-util'),
    stripDebug = require('gulp-strip-debug'),
    uncss = require('gulp-uncss'),
    minifyCSS = require('gulp-minify-css'),
    minify = require('gulp-minify');


// set up the paths
var jsSources = ['js/vendor/jquery-2.1.3.min','js/vendor/phaser.min.js','js/*.js', 'js/entities/*.js'];


// clean the build folder
gulp.task('clean', function(cb) {
  del(['dist'], cb);
});


// concat all scripts
gulp.task('scripts',['clean'], function(){
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(gulp.dest('dist/'))
});


// remove unused css selectors
gulp.task('uncss',['clean'], function(){
  gulp.src('css/main.css')
    .pipe(uncss({ 
      html: ['index.html']
    }))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(gulp.dest('dist/'))
});


// concat all scripts
gulp.task('prodScripts',['clean'], function(){
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(stripDebug())
		.pipe(minify())
		.pipe(gulp.dest('dist/'))
});


// serve the game up
gulp.task('serve', ['clean', 'scripts'],function() {
  connect.server({
    root: ''
  });
});


// serve the game up
gulp.task('serveFinal', ['clean', 'prodScripts'],function() {
  connect.server({
    root: ''
  });
});


// for development
gulp.task('build', ['clean', 'scripts', 'serve']);

// for production
gulp.task('build-final', ['clean', 'prodScripts', 'uncss', 'serveFinal']);
