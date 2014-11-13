
var gulp = require('gulp')
    ,browserify = require('browserify')
    ,connect = require('gulp-connect')
    //,concat = require('gulp-concat')
    //,styl = require('gulp-styl')
    ,disc = require('disc')
    ,fs = require('fs')
    ,livereload = require('gulp-livereload')
    ,nodemon = require('gulp-nodemon')
    ,reactify = require('reactify')
    ,rename = require("gulp-rename")
    ,source = require('vinyl-source-stream')
    ,watchify = require('watchify');
    ;

var clean = require('gulp-clean');

var production = process.env.NODE_ENV === 'production';


var vendorFiles = [
    'bower_components/react/react-with-addons.js'];
    //'node_modules/es6ify/node_modules/traceur/bin/traceur-runtime.js'];
var vendorBuild = 'build/vendor';
var requireFiles = './node_modules/react/react.js';

gulp.task('vendor', function () {
    return gulp.src(vendorFiles).
        pipe(gulp.dest(vendorBuild));
});

//process.env.BROWSERIFYSHIM_DIAGNOSTICS=1

var CLIENT_SCRIPTS = './portal/static/js/';

gulp.task('client', function() {

    scripts(true);
});

function scripts(watch) {

    var bundler, rebundle;
    bundler = browserify(CLIENT_SCRIPTS + 'main.js', {
        basedir: __dirname,
        debug: !production,
        cache: {}, // required for watchify
        packageCache: {}, // required for watchify
        fullPaths: true // required to be true only for watchify
    });
    if(watch) {
        bundler = watchify(bundler)
    }

    var hbsfy = require('hbsfy').configure({
        extensions: ["html"]
    });
    bundler.transform(hbsfy);

    bundler.require(requireFiles);
    bundler.transform(reactify);

    rebundle = function() {
        console.log('rebundling');
        var stream = bundler.bundle();
        stream.on('error', function (err) { console.error(err) });
        //stream.on('error', handleError('Browserify'));
        //stream = stream.pipe(disc());
        //var disc = stream.pipe(disc())
        //    .pipe(fs.createWriteStream('./build/disc.html'));

        return stream.pipe(source('bundle.js'))
            .pipe(gulp.dest('./build'))
            .pipe(livereload());
    };

    bundler.on('update', rebundle);
    return rebundle();
    /*
    var b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true
    });
    b = watchify(b);
    b.transform(reactify);
    //var b = watchify(CLIENT_SCRIPTS + 'main.js');
    b.on('update', function() {
        bundleShare(b)
    });
     b.add(CLIENT_SCRIPTS + 'main.js');
    var b = watchify(CLIENT_SCRIPTS + 'main.js');
    bundleShare(b);
     */
}

/*
function bundleShare(b) {
    var bundleStream = b.bundle();

    var t = bundleStream
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build'));
        // Refresh browser
        //.pipe(livereload());
}
*/

gulp.task('connect', function() {
  connect.server({
    root: 'portal',
    livereload: true
  });
});

/*
gulp.task('watch', function() {
    gulp.watch(CLIENT_SCRIPTS + '**', ['client']);
})
*/

gulp.task('node_server', function () {
    nodemon({ script: './nodejs/index.js', watch: './nodejs'})
    //.on('restart', ['lint'])
})

// Dev server
gulp.task('default', ['client']);
//gulp.task('default', ['client', 'node_server']);
//gulp.task('default', ['client', 'node_server', 'watch']);

// Local OSX
//gulp.task('default', ['client', 'connect', 'watch']);

