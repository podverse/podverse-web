/* Thanks to Ashwin Hariharan
https://medium.freecodecamp.com/webpack-for-the-fast-and-the-furious-bf8d3746adbd#.4ijclp4kt */

var webpack = require("webpack");
var path = require("path");

var lib_dir = __dirname + "/src/static/libs",
    node_dir = __dirname + "/node_modules";

var config = {
    resolve: {
        alias: {
            bootstrap: node_dir + "/bootstrap/dist/js/bootstrap.min.js",
            jquery: node_dir + "/jquery/dist/jquery.min.js",
            jqueryCookie: node_dir + "/jquery.cookie/jquery.cookie.js",
            mediaElement: node_dir + "/mediaelement/build/mediaelement-and-player.min.js",
            mejsPlaybackRate: lib_dir + "/vendors/mejs_playbackrate_plugin.js",
            tether: node_dir + "/tether/dist/js/tether.min.js",
            truncate: node_dir + "/truncate.js/dist/truncate.min.js",
            typeahead: node_dir + "/typeahead.js/dist/typeahead.bundle.min.js"
        }
    },

    entry: {
        'home/index': [__dirname + '/src/static/libs/js/views/home/index.js'],
        'login/redirect': [__dirname + '/src/static/libs/js/views/login/redirect.js'],
        'player-page/index': [__dirname + '/src/static/libs/js/views/player-page/index.js'],
        vendors: ["babel-polyfill",
                  "bootstrap",
                  "jquery",
                  "jqueryCookie",
                  "mediaElement",
                  "mejsPlaybackRate",
                  "tether",
                  "truncate",
                  "typeahead"]
    },

    // Thanks:D Peter Tseng http://stackoverflow.com/a/39842495/2608858
    output: {
        path: __dirname + '/src/static/libs/build',
        filename: '[name].js'
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery",
            "window.Tether": "tether",
            "Bloodhound": "typeahead"
        }),
        new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js", Infinity)
    ],

    // Thanks:D James K Nelson http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/
    module: {
      loaders: [
        {
          loader: "babel-loader",
          include: [
            path.resolve(__dirname, "src")
          ],
          test: /\.js$/,
          query: {
            plugins: ['transform-runtime'],
            presets: ['es2015']
          }
        }
      ]
    }

};

module.exports = config;
