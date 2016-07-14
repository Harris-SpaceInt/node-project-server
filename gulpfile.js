var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('public/views/**/*.html', browserSync.reload);
    gulp.watch('public/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    })
});