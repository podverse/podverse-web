/* Thanks to Ashwin Hariharan
https://medium.freecodecamp.com/webpack-for-the-fast-and-the-furious-bf8d3746adbd#.4ijclp4kt */

var webpack = require('webpack');
var path = require("path");

var lib_dir = __dirname + '/src/static/libs',
    node_dir = __dirname + '/node_modules';

var config = {
    resolve: {
        alias: {
            bootstrap: node_dir + '/bootstrap/dist/js/bootstrap.min.js',
            jquery: node_dir + '/jquery/dist/jquery.min.js',
            jqueryCookie: node_dir + '/jquery.cookie/jquery.cookie.js',
            mediaElement: node_dir + '/mediaelement/build/mediaelement-and-player.min.js',
            mejsPlaybackRate: lib_dir + '/js/mejs_playbackrate_plugin.js',
            tether: node_dir + '/tether/dist/js/tether.min.js',
            truncate: lib_dir + '/vendors/truncate.min.js',
            typeahead: node_dir + '/typeahead.js/dist/typeahead.bundle.min.js'
        }
    },

    entry: {
        app: ['./src/static/libs/js/index.js'],
        vendors: ['bootstrap',
                  'jquery',
                  'jqueryCookie',
                  'mediaElement',
                  'mejsPlaybackRate',
                  'tether',
                  'truncate',
                  'typeahead']
    },

    output: {
        path: path.join(__dirname, "src/static/libs/build"),
        filename: "bundle.js"
    },

    plugins: [
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            'window.jQuery': "jquery",
            'window.$': "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity)
    ]

    // module: {
    //     noParse: [
    //         new RegExp(lib_dir + '/react.js'),
    //         new RegExp(lib_dir +'/jquery-1.11.2.min.js')
    //     ],
    //     loaders: [
    //         {
    //             test: /\.js$/,
    //             loader: 'babel',
    //             query: {
    //                 presets: ['react', 'es2015']
    //             }
    //         },
    //     ]
    // }
};

module.exports = config;
