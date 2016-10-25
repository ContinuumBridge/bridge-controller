
var nodemon = require('nodemon');
var path = require('path');
var webpack = require("webpack");

/*
new webpack.optimize.CommonsChunkPlugin({
    name:"vendor",
    filename: "vendor.js",
    minChunks: Infinity
});
*/

module.exports = {
    entry: {
        bundle: './portal/static/js/main.js'
        //vendor: [
        //    './portal/static/js/vendor/vendor'
        //]
    },
    output: {
        path: 'build',
        filename: '[name].js'
    },
    plugins: [
        /*
        new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            //jQuery: "jquery",
            "window.Backbone": "imports?root=>{}!backbone"
            //"Backbone": "imports?root=>{}!backbone"
        })
        */
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|backbone)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
          //{ test: /\.jsx?$/, loader: 'babel-loader' },
          //{ test: require.resolve("underscore"), loader: "expose?_" },
          //{ test: require.resolve("backbone"), loader: "imports?root=>{}!backbone" },
          //{ test: require.resolve("./portal/static/js/vendor/backbone/backbone.marionette.js"), loader: "expose?Marionette" },
          //{ test: require.resolve("query-engine"), loader: "expose?QueryEngine!imports?Backbone=backbone" }
          //{ test: require.resolve("query-engine"), loader: "expose?QueryEngine" }
        ]
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            'backbone-bundle': path.join(__dirname, '/portal/static/js/vendor/backbone/backbone-bundle.js')
        },
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js']
    },
    watch: true,
    watchOptions: {
        poll: true
    }
};

// Start the server
nodemon({
    ignore: ['portal/*', 'build/*'],
    script: './nodejs/index.js',
    execMap: {
        js: 'node'
    },
    ext: 'js json'
});

nodemon.on('start', function () {
    console.log('Node server has started');
}).on('quit', function () {
    console.log('Node server has quit');
}).on('restart', function (files) {
    console.log('Node server restarted due to: ', files);
});
