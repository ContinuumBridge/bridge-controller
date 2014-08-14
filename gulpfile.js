
var gulp = require('gulp')
    ,browserify = require('browserify')
    ,connect = require('gulp-connect')
    //,concat = require('gulp-concat')
    //,styl = require('gulp-styl')
    ,livereload = require('gulp-livereload')
    ,nodemon = require('gulp-nodemon')
    ,rename = require("gulp-rename")
    ,source = require('vinyl-source-stream')
    ;

var clean = require('gulp-clean');

var CLIENT_SCRIPTS = './portal/static/js/';

gulp.task('clean', function () {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('client', function() {

    var hbsfy = require('hbsfy').configure({
        extensions: ["html"]
    })

    var b = browserify();
    b.add(CLIENT_SCRIPTS + 'main.js');
    b.transform(hbsfy);
    var bundleStream = b.bundle();

    var t = bundleStream
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build'))
        // Refresh browser
        .pipe(livereload());
})

gulp.task('connect', function() {
  connect.server({
    root: 'portal',
    livereload: true
  });
});

gulp.task('watch', function() {
    gulp.watch(CLIENT_SCRIPTS + '**', ['client']);
})

gulp.task('node_server', function () {
    nodemon({ script: './nodejs/index.js', watch: './nodejs'})
    //.on('restart', ['lint'])
})

// Dev server
gulp.task('default', ['client', 'node_server', 'watch']);

// Local OSX
//gulp.task('default', ['client', 'connect', 'watch']);

