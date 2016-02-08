"use strict";

let RSS = require('rss'),
  _ = require('lodash');

module.exports = function playlistRssConverter (playlist, opts) {

  opts = opts || {};
  opts.site_url = opts.site_url || 'http://example.com';

  let feed = new RSS(Object.assign({
    title: playlist.title,
    site_url: opts.site_url
  }, playlist));

  feed.generator= 'podverse.tv';

  _.forEach(playlist.items, item => {

    const conf = Object.assign({
      enclosure: {
        url: item.mediaURL
      }
    }, item);

    feed.item(conf);
  });

  return feed.xml({indent:true});


};
