var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var shell = require('gulp-shell');


//----------------------------------------------------------------------------------------------------------------------
// default task to start up the server when
//   the user types "gulp"

gulp.task('default', ['start'], function() {});


//----------------------------------------------------------------------------------------------------------------------
// tasks to update all connected browsers when
//   the html is changed
// used for development

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


//----------------------------------------------------------------------------------------------------------------------
// initialization task that the user should call once
//   before starting the server for the first time

gulp.task('init-server', shell.task([
    'chmod +x ./mongodb/bin/mongod',
    'mkdir ./data'
]));


//----------------------------------------------------------------------------------------------------------------------
// helper tasks for starting and stopping the server
// these will probably not be run on their own

gulp.task('start-mongo', shell.task(['./mongodb/bin/mongod --dbpath ./data &>/dev/null &']));

gulp.task('stop-mongo', ['stop-server'], shell.task(['pkill -9 mongod']));

gulp.task('start-server', ['start-mongo'], shell.task(['pm2 start server.js']));

gulp.task('stop-server', shell.task(['pm2 stop server.js']));


//----------------------------------------------------------------------------------------------------------------------
// tasks the user can use to start, restart, and stop the server

gulp.task('restart', shell.task(['pm2 restart server.js']));

gulp.task('start', ['start-server'], function() {});

gulp.task('stop', ['stop-mongo'], function() {});