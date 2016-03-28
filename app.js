"use strict";

let feathers   = require('feathers'),
    bodyParser = require('body-parser'),
    nunjucks  = require('nunjucks'),

    attachRoutes = require('./routes.js'),
    app = feathers();

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

var env = nunjucks.configure(__dirname + '/templates', {
  autoescape: true,
  cache: false,
  express: app
});

env.addFilter('stringify', function(str) {
  var s = JSON.stringify(str);
  return s;
});

env.addFilter('readableDate', function(date) {
  return date.substring(0, 10);
});

// TODO: This identify function is also in the scripts.js. Probably this should
// be refactored somehow.
env.addFilter('convertSecToHHMMSS', function(sec) {
    // thanks to dkreuter http://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    var totalSec = sec;

    var hours = parseInt(totalSec / 3600) % 24;
    var minutes = parseInt(totalSec / 60) % 60;
    var seconds = totalSec % 60;
    var result = '';

    if (hours > 0) {
      result += hours + ':';
    }

    if (minutes > 9) {
      result += minutes + ':';
    } else if (minutes > 0 && hours > 0) {
      result += '0' + minutes + ':';
    } else if (minutes > 0){
      result += minutes + ':';
    }

    if (seconds > 9) {
      result += seconds;
    } else if (seconds > 0 && minutes > 0) {
      result += '0' + minutes + ':';
    } else if (seconds > 0) {
      result += seconds;
    } else {
      result += '00';
    }

    return result;
});



app.use('/bower_components', feathers.static(__dirname + '/bower_components'));
app.use('/libs', feathers.static(__dirname + '/libs'));



attachRoutes(app);


///////////
///
///
module.exports = app;
