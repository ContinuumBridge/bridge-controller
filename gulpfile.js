
var gulp = require('gulp')
    ,browserify = require('browserify')
    //,concat = require('gulp-concat')
    //,styl = require('gulp-styl')
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

    var b = browserify();
    b.add(CLIENT_SCRIPTS + 'main.js');
    var bundleStream = b.bundle();

    var t = bundleStream
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build'));
})

gulp.task('watch', function() {
    gulp.watch(CLIENT_SCRIPTS + '**', ['client']);
})

gulp.task('node_server', function () {
    nodemon({ script: './nodejs/index.js', ext: 'html js'})
    //.on('restart', ['lint'])
})

gulp.task('default', ['client', 'node_server', 'watch']);


