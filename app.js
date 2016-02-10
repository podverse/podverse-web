"use strict";

let feathers   = require('feathers'),
    bodyParser = require('body-parser'),
    nunjucks  = require('nunjucks'),

    config = require('./config.js'),
    attachRoutes = require('./routes.js'),
    app = feathers(),
    playlistServiceFactory = require('./playlistServiceFactory.js');



app.configure(feathers.rest(function restFormatter (req, res) {

  res.format({
    'default': () => {
      res.json(res.data);
    },
    'application/json': () => {
      res.json(res.data);
    },
    'application/rss+xml': () => {
      let playlistRssConverter = require('./PlaylistRSSConverter.js');
      res.end(playlistRssConverter(res.data));
    }
  });
}));



app.use(bodyParser.json());
nunjucks.configure(__dirname + '/templates', {
  autoescape: true,
  cache: false,
  express: app
});

app.use('/bower_components', feathers.static(__dirname + '/bower_components'));
app.use('/libs', feathers.static(__dirname + '/libs'));



attachRoutes(app);

//
//// Playlists
app.use('/pl', playlistServiceFactory());

///////////
///
///
app.listen(config.port, () => {
  console.log('Listening on port %s...', config.port);
});
