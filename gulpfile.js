'use strict';
var gulp = require('gulp');
var fs = require('fs');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var browserSync = require('browser-sync');
var pm2 = require('pm2');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var pkg = require('./package.json');
var path = require('path');
var colors = require('colors');
var gutil = require('gulp-util');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var globArray = require('glob-array');

global.__baseDir = __dirname;

var PROCESS_CONFIG = {
  name: pkg.name,
  script: 'lib',
  error_file: path.normalize(__dirname + '/server.log'),
  out_file: path.normalize(__dirname + '/server.log'),
  merge_logs: true,
  env: {
    NODE_ENV: 'development',
    PORT: 4444
  }
};


function errorHandler(error){
  if(error.stack){
    console.error(error.stack);
  }
  this.emit('end');
}

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .on('error', errorHandler)
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp('package.json', cb);
});

gulp.task('pre-test', function () {
  return gulp.src('lib/**/*.js')
    .pipe(istanbul({
      includeUntested: true
    }))
    .on('error', errorHandler)
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaError;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      if(!err.stack) {
        mochaError = err;
      } else {
        throw err;
      }
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      if(mochaError && mochaError.stack){
        console.error(mochaError.stack);
      }
      process.exit(mochaError ? 1 : 0);
    });
})

gulp.task('lite-test', function () {
  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', errorHandler);
});

gulp.task('browser-sync', ['pm2:start'], function() {
	browserSync.init(null, {
		proxy: 'http://localhost:' + PROCESS_CONFIG.env.PORT,
        files: ['public/**/*.*', 'views/**/*.*'],
        browser: 'google chrome',
        port: 7000,
	});
});

gulp.task('pm2:start', function(cb){
  pm2.connect(function(){
    pm2.start(PROCESS_CONFIG, function(err, proc){
      if (err) {
        throw new Error('Error starting ' + pkg.name + ': ' + JSON.stringify(err));
      }
      if(proc[0]) {
        console.log(colors.yellow('Server started on port ' + proc[0].pm2_env.PORT + ' and logging to: ') + proc[0].pm2_env.pm_out_log_path);
      }
      pm2.disconnect();
      return cb();
    });
  });
});


gulp.task('pm2:restart', function(cb){
  pm2.connect(function(){
    pm2.restart(PROCESS_CONFIG.name, function(err){
      if (err) {
        throw new Error('Error starting ' + pkg.name + ': ' + JSON.stringify(err));
      }
      pm2.disconnect();
      return cb();
    });
  });
});

gulp.task('watch', function(){
  watch(['lib/**/*', 'config.js'], batch(function(events, done){
    gulp.start('pm2:restart', done);
  }));
});

gulp.task('docs', function(){
  var partial = globArray.sync(['docs/partial/**/*.hbs']);
  partial = partial.map(function(globPath){
    return path.normalize(path.join(__dirname, globPath));
  });
  return gulp.src('lib/**/*.js')
    .pipe(concat("README.md"))
    .pipe(gulpJsdoc2md({
      template: fs.readFileSync('./docs/README.md.hbs', 'utf8'),
      partial: partial,
      separators: true,
      'heading-depth': 3
    }))
    .on('error', function(err){
        gutil.log(gutil.colors.red('jsdoc2md failed'), err.message)
    })
    .pipe(gulp.dest('api'));
});

gulp.task('mocha-watch', ['lite-test'], function(){
  watch(['test/**/*', 'lib/**/*', 'config.js'], batch(function(events, done){
    gulp.start('lite-test', done);
  }));
});


gulp.task('prepublish', ['nsp']);
gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('default', ['static', 'test']);

process.on('SIGINT', function(){
  pm2.connect(function(){
    pm2.stop(PROCESS_CONFIG.name, function(err){
      if(err) {
        return process.exit(255);
      }
      pm2.delete(PROCESS_CONFIG.name, function(error){
        if(error) {
          return process.exit(255);
        }
        process.exit(0);
      });
    });
  });
});
