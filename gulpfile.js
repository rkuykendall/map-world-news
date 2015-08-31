/*eslint-disable no-var, no-console, vars-on-top*/

var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var fs = require('fs');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ghPages = require('gulp-gh-pages');

var webpackConfig = require('./webpack.config.js')

gulp.task('dev', function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(webpackConfig);

    new WebpackDevServer(compiler, {
        contentBase: './web',
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

gulp.task('deploy', function(callback) {
  // run webpack
  webpack(webpackConfig, function(err, stats) {
      if (err) throw new gutil.PluginError('webpack', err);
      gutil.log('[webpack]', stats.toString({
          // output options
      }));
      callback();
  });

  return gulp.src('./web/**/*')
    .pipe(ghPages({ force: true }));
});
