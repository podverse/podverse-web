/* Thanks to Ashwin Hariharan
https://medium.freecodecamp.com/webpack-for-the-fast-and-the-furious-bf8d3746adbd#.4ijclp4kt */

var webpack = require("webpack"),
    path = require("path"),
    config = require("src/config.js");

var lib_dir = __dirname + "/src/static/libs";

module.exports ={
    resolve: {
        alias: {
            bootstrap: "bootstrap/dist/js/bootstrap.min.js",
            jquery: "jquery/dist/jquery.min.js",
            jqueryCookie: "jquery.cookie/jquery.cookie.js",
            mediaElement: "mediaelement/build/mediaelement-and-player.min.js",
            mejsPlaybackRate: lib_dir + "/vendors/mejs_playbackrate_plugin.js",
            mepFeaturePlaylist: lib_dir + "/vendors/mep-feature-playlist.js",
            tether: "tether/dist/js/tether.min.js",
            typeahead: "typeahead.js/dist/typeahead.bundle.min.js"
        }
    },

    entry: {
        'about/index': [__dirname + '/src/static/libs/js/views/about/index.js'],
        // 'faq/index': [__dirname + '/src/static/libs/js/views/faq/index.js'],
        'home/index': [__dirname + '/src/static/libs/js/views/home/index.js'],
        'login/redirect': [__dirname + '/src/static/libs/js/views/login/redirect.js'],
        // 'mobile-app/index': [__dirname + '/src/static/libs/js/views/mobile-app/index.js'],
        'my-playlists/index': [__dirname + '/src/static/libs/js/views/my-playlists/index.js'],
        'my-podcasts/index': [__dirname + '/src/static/libs/js/views/my-podcasts/index.js'],
        'player-page/index': [__dirname + '/src/static/libs/js/views/player-page/index.js'],
        'podcast/index': [__dirname + '/src/static/libs/js/views/podcast/index.js'],
        'podcasts/index': [__dirname + '/src/static/libs/js/views/podcasts/index.js'],
        'settings/index': [__dirname + '/src/static/libs/js/views/settings/index.js'],
        vendors: ["babel-polyfill",
                  "bootstrap",
                  "jquery",
                  "jqueryCookie",
                  "mediaElement",
                  "mejsPlaybackRate",
                  "mepFeaturePlaylist",
                  "tether",
                  "typeahead"]
    },

    // Thanks:D Peter Tseng http://stackoverflow.com/a/39842495/2608858
    output: {
        path: __dirname + '/src/static/libs/build',
        filename: '[name].js'
    },

    plugins: [
        new webpack.DefinePlugin({
            __AUTH0_CLIENTID__: JSON.stringify(config.auth0ClientId),
            __AUTH0_DOMAIN__: JSON.stringify(config.auth0Domain),
            __BASE_URL__: JSON.stringify(config.baseURL),
            __GOOGLE_ANALYTICS_UA__: JSON.stringify(config.googleAnalyticsUA),
            __IS_PROD__: process.env.NODE_ENV === 'production'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery",
            'window.Tether': 'tether',
            "tether": 'tether',
            "Tether": 'tether',
            "Bloodhound": "typeahead",
            "Auth0Lock": "auth0-lock"
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
