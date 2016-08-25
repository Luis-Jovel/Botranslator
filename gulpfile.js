var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')();

function errHandler(title) {
	return plugins.plumber({
		errorHandler: plugins.notify.onError({
			title: title || 'Error running Gulp',
			message: "<%= error.message %>"
		})
	});
}
gulp.task('coffee', function () {
	gulp.src('./*.coffee')
	.pipe(errHandler("Error CoffeeScript"))
	.pipe(plugins.coffee())
	.pipe(gulp.dest('./'))
});

gulp.task('watch', ['coffee'], function () {
	gulp.watch('./*.coffee', ['coffee']);
});

gulp.task('default', ['watch']);