
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
        bundle: './portal/static/js/main.js',
        /*
        vendor: [
            './portal/static/js/vendor/vendor'
            './portal/static/js/vendor/react/react-bundle',
            'jquery',
            'react',
            'react-router',
            './portal/static/js/vendor/backbone/backbone-bundle',
            'backbone.marionette'
        ]
        */
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
    /*
    externals: {
        backbone: "Backbone"
    },
    */
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|backbone)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
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