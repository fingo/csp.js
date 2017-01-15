var gulp = require('gulp'),
    karma = require('gulp-karma'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');



gulp.task('build', function(done) {

    gulp.src('./src/*.js')
        .pipe(concat('ngCsp.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('ngCsp.min.js'))
        .pipe(gulp.dest('dist'));

});

gulp.task('minify', function(done) {

    gulp.src('./dist.ngCsp.js')
        .pipe(uglify())
        .pipe(rename('ngCsp.min.js'))
        .pipe(gulp.dest('dist'));

});

gulp.task("dist", ["build", "minify"], function () {});


gulp.task('test', function () {
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action : 'run'
        }))
        .on('error', function (err) {
            console.log(err);
            this.emit('end');
        });
});