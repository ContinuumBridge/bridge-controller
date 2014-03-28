
var gulp = require('gulp')
    ,browserify = require('gulp-browserify')
    //,concat = require('gulp-concat')
    //,styl = require('gulp-styl')
    ,rename = require("gulp-rename")
    ,nodemon = require('gulp-nodemon')
    ;

gulp.task('scripts', function() {
    gulp.src(['portal/static/js/main.js'])
        .pipe(browserify({debug: true}))
        .pipe(rename("bundle.js"))
        .pipe(gulp.dest('build'))
})

gulp.task('node_server', function () {
  nodemon({ script: './nodejs/index.js', ext: 'html js'})
    //.on('restart', ['lint'])
})

gulp.task('default', function() {
    // Run the script initially
    gulp.run('scripts');

    gulp.watch('portal/static/js/**', function(event) {
        gulp.run('scripts');
    })

    gulp.run('node_server');
})


