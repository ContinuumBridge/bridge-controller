
var gulp = require('gulp')
    ,browserify = require('browserify')
    ,connect = require('gulp-connect')
    //,concat = require('gulp-concat')
    //,styl = require('gulp-styl')
    //,disc = require('disc')
    ,fs = require('fs')
    ,livereload = require('gulp-livereload')
    ,nodemon = require('gulp-nodemon')
    ,reactify = require('reactify')
    ,rename = require("gulp-rename")
    ,source = require('vinyl-source-stream')
    //,uglify = require('gulp-uglify')
    ,watchify = require('watchify');
    ;

var clean = require('gulp-clean');

var production = process.env.NODE_ENV === 'production';


var vendorFiles = [
    'node_modules/react/dist/react-with-addons.js',
    'node_modules/backbone-react-component/dist/backbone-react-component.js'
];

var VENDOR_SCRIPTS = './portal/static/js/vendor/';
    //'node_modules/es6ify/node_modules/traceur/bin/traceur-runtime.js'];

var vendorBuild = 'build/vendor';
var requireFiles = './node_modules/react/react.js';

gulp.task('vendor', function () {

    //var bundler = browserify(VENDOR_SCRIPTS + 'vendor.js')
    var bundler = browserify(VENDOR_SCRIPTS + 'vendor.js', {
        basedir: __dirname,
        //debug: !production,
        cache: {}, // required for watchify
        packageCache: {}, // required for watchify
        fullPaths: true // required to be true only for watchify
    });

    bundler = watchify(bundler);

    bundler.transform(reactify);
    // Used for react-bootstrap
    //bundler.transform('folderify');

    var rebundle = function() {
        console.log('rebundling vendor');

        var stream = bundler.bundle();
        stream.on('error', function (err) { console.error(err) });

        return stream.pipe(source('vendor.js'))
            .pipe(gulp.dest('./build'))
            .pipe(livereload());
        /*
        var stream = bundler.bundle()
            .pipe(source('vendor.js'))
            //.pipe(rename('vendor.js'))
            .pipe(gulp.dest('build'))
            .pipe(livereload());
            ;
        */
    }

    bundler.on('update', rebundle);
    return rebundle();
    //return gulp.src(vendorFiles)
        //.pipe(source('vendor.js'))
});

//process.env.BROWSERIFYSHIM_DIAGNOSTICS=1

var CLIENT_SCRIPTS = './portal/static/js/';

gulp.task('client', function() {

    scripts(true);
});

function scripts(watch) {

    var bundler = browserify(CLIENT_SCRIPTS + 'main.js', {
        basedir: __dirname,
        //debug: !production,
        cache: {}, // required for watchify
        packageCache: {}, // required for watchify
        fullPaths: true // required to be true only for watchify
    });

    //var cssify = require('cssify');
    //bundler.transform(cssify);

    if(watch) {
        bundler = watchify(bundler)
    }

    var hbsfy = require('hbsfy').configure({
        extensions: ["html"]
    });
    bundler.transform(hbsfy);

    bundler.external('react');
    bundler.external('backbone-bundle');
    //bundler.require(requireFiles);
    bundler.transform(reactify);

    var rebundle = function() {
        console.log('rebundling client');
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

gulp.task('copy', function(cb) {
    gulp.src(['../presence_store/swarm/models/**/*']).pipe(gulp.dest('./nodejs/swarm/models'));
    cb();
    //.on('restart', ['lint'])
});

gulp.task('node_server', ['copy'], function() {
    nodemon({ script: './nodejs/index.js', watch: './nodejs/**'});
    //.on('restart', ['lint'])
})

// Dev server
gulp.task('default', ['client', 'vendor', 'node_server']);

//gulp.task('default', ['client', 'node_server']);
//gulp.task('default', ['client', 'node_server', 'watch']);

// Local OSX
//gulp.task('default', ['client', 'connect', 'watch']);

