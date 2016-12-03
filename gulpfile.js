const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
  browserSync.init({
    proxy: {
      target: "localhost:8080", // can be [virtual host, sub-directory, localhost with port]
      ws: true // enables websockets
    }
  });
  
  gulp.watch('./src/**/*.js', ['delayBrowserSync']);
  gulp.watch('./public/*.html').on('change', browserSync.reload);
  gulp.watch('./public/**/*.js', ['delayBrowserSync']);
  gulp.watch('./public/css/**/*.css').on('change', browserSync.reload);
  gulp.watch('./views/**/*.ejs').on('change', browserSync.reload);
});

gulp.task('delayBrowserSync', function () {
  setTimeout(() => {
    browserSync.reload({ stream: false });
  }, 3000);
})

gulp.task('start', function (cb) {
  var started = false;
  nodemon({
    script: 'src/index.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default', ['start', 'browser-sync']);
