var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var shell = require('gulp-shell');

gulp.task('default', ['start'], function() {});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch('public/**/*', browserSync.reload);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    })
});

gulp.task('init-server', shell.task([
    'chmod +x ./mongodb/bin/mongod',
    'mkdir ./data'
]));

gulp.task('start-mongo', shell.task(['./mongodb/bin/mongod --dbpath ./data &>/dev/null &']));

gulp.task('stop-mongo', shell.task(['service mongod stop']));

gulp.task('start', ['start-mongo'], shell.task(['pm2 start server.js']));

gulp.task('restart', shell.task(['pm2 restart server.js']));

gulp.task('stop', shell.task(['pm2 stop server.js']));