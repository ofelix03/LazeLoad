var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump')

gulp.task('js-minify', function(cb){
	pump([
			gulp.src('lazeload.js'),
			uglify(),
			gulp.dest('dist/*.min.js')
		], cb);
});