var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('minify', function () {
    gulp.src('iris/static/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'))
});
