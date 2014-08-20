var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    gzip = require('gulp-gzip'),
    awspublish = require('gulp-awspublish'),
    rename = require('gulp-rename'),
    fs = require('fs');

gulp.task('deploy', function () {
    var publisher = awspublish.create({ key: process.env.AWS_KEY,  secret: process.env.AWS_SECRET, bucket: 'mapworldnews.com' });

    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
        // ...
    };

    gulp.src('./iris/static/index.html')
        .pipe(publisher.publish(headers))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());

    gulp.src('./iris/static/js/**')

        // gzip, Set Content-Encoding headers and add .gz extension
        // .pipe(awspublish.gzip({ ext: '.gz' }))

        .pipe(rename(function (path) {
            path.dirname = '/static/js/' + path.dirname;
        }))

        // publisher will add Content-Length, Content-Type and  headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))

        // create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())

         // print upload updates to console
        .pipe(awspublish.reporter());

    gulp.src('./iris/static/css/*')
        .pipe(rename(function (path) {
            path.dirname += '/static/css';
        }))
        .pipe(publisher.publish(headers))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());

    gulp.src('./iris/static/img/*')
        .pipe(rename(function (path) {
            path.dirname += '/static/img';
        }))
        .pipe(publisher.publish(headers))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());

    gulp.src('./iris/static/json/*')
        .pipe(rename(function (path) {
            path.dirname += '/static/json';
        }))
        .pipe(publisher.publish(headers))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());

});
