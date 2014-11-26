var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function () {
    return gulp.src([
        'node_modules/spark-md5/spark-md5.js',
        'angular-file-service.js'
    ])
    .pipe(sourcemaps.init())
        .pipe(concat('angular-file-service.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'));
});
