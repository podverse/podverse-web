"use strict";

var playlistRssConverter = require('../PlaylistRSSConverter.js');
var expect = require('chai').expect;
describe('PlaylistRssConverter', function () {

  it('should not error', function () {

    let rss = playlistRssConverter({
      title: 'a title',
      description: 'foo',

      items: [
        {mediaURL: 'fff', guid:'asdf'}
      ]
    });

    expect(rss).to.be.ok;
  });
});
