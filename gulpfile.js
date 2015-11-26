var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins();

gulp.task('runTests', function() {
	return gulp
		.src('./test/*.js')
		.pipe(plugins.mocha());
});