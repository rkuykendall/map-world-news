/*eslint-disable no-var, no-console, vars-on-top*/

var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var awspublish = require('gulp-awspublish');
var rename = require('gulp-rename');
var fs = require('fs');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ghPages = require('gulp-gh-pages');

var webpackConfig = require('./webpack.config.js')

gulp.task('webpack', function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('dev', function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        contentBase: './app/static',
        hot: true,
        watchOptions: {
            aggregateTimeout: 100,
            poll: 300
        },
        noInfo: true
    }).listen(8080, 'localhost', function(err) {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);

        // Server listening
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/');

        // keep the server alive or continue?
        // callback();
    });
});

gulp.task('deploy', function() {
  return gulp.src('./app/static/**/*')
    .pipe(ghPages());
});


// gulp.task('deploy', function () {
//     var publisher = awspublish.create({
//         'params': {
//             'Bucket': 'mapworldnews.com'
//         },
//         'accessKeyId': process.env.AWS_KEY,
//         'secretAccessKey': process.env.AWS_SECRET
//     });
//
//     var headers = {
//         'Cache-Control': 'max-age=315360000, no-transform, public'
//         // ...
//     };
//
//     gulp.src('./app/static/index.html')
//         .pipe(publisher.publish(headers))
//         .pipe(publisher.cache())
//         .pipe(awspublish.reporter());
//
//     gulp.src('./app/static/js/**')
//
//         // gzip, Set Content-Encoding headers and add .gz extension
//         // .pipe(awspublish.gzip({ ext: '.gz' }))
//
//         .pipe(rename(function (path) {
//             path.dirname = '/static/js/' + path.dirname;
//         }))
//
//         // publisher will add Content-Length, Content-Type and headers specified above
//         // If not specified it will set x-amz-acl to public-read by default
//         .pipe(publisher.publish(headers))
//
//         // create a cache file to speed up consecutive uploads
//         .pipe(publisher.cache())
//
//          // print upload updates to console
//         .pipe(awspublish.reporter());
//
//     gulp.src('./app/static/css/*')
//         .pipe(rename(function (path) {
//             path.dirname += '/static/css';
//         }))
//         .pipe(publisher.publish(headers))
//         .pipe(publisher.cache())
//         .pipe(awspublish.reporter());
//
//     gulp.src('./app/static/img/*')
//         .pipe(rename(function (path) {
//             path.dirname += '/static/img';
//         }))
//         .pipe(publisher.publish(headers))
//         .pipe(publisher.cache())
//         .pipe(awspublish.reporter());
//
//     gulp.src('./app/static/json/*')
//         .pipe(rename(function (path) {
//             path.dirname += '/static/json';
//         }))
//         .pipe(publisher.publish(headers))
//         .pipe(publisher.cache())
//         .pipe(awspublish.reporter());
//
// });
