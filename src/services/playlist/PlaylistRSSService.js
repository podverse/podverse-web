const
    PodcastRSS = require('podcast'),
    uuid = require('uuid');

let generatePlaylistRSSFeed = (playlist) => {
  let podcastImageURL = `${
    playlist.mediaRefs.length > 0 ?
    playlist.mediaRefs[0].podcastImageURL :
    'https://podverse.fm/static/images/podverse-logo-180.png'
  }`;

  const feedOptions = {
    title: 'Playlist: ' + playlist.title,
    description: 'Created with podverse.fm',
    generator: 'podverse.fm',
    feed_url: `https://podverse.fm/playlists/${playlist.id}?rssFeed`,
    site_url: `https://podverse.fm/playlists/${playlist.id}`,
    image_url: podcastImageURL,
    docs: 'https://podverse.fm/about',
    author: playlist.ownerName,
    managingEditor: playlist.ownerName,
    webMaster: playlist.ownerName,
    copyright: 'AGPLv3',
    language: 'English',
    categories: 'playlists',
    pubDate: playlist.lastUpdated,
    // TODO: do we want to set ttl?
    // ttl: '', // number of minutes feed can be cached before refreshing from source

    // we need to set itunesSummary to an empty string, or podcastRSS
    // will automatically fill it out
    itunesSummary: '', //,
    itunesImage: podcastImageURL
    // other options
    // itunesAuthor: '', // playlist.ownerName,
    // itunesSubtitle: '', // 'Created with podverse.fm',
    // itunesOwner: '', // playlist.ownerName,
    // itunesExplicit: '',
    // itunesCategories: ''
  }

  const feed = new PodcastRSS(feedOptions);

  for (let mediaRef of playlist.mediaRefs) {
    let itemOptions = {
      title: mediaRef.episodeTitle,
      description: mediaRef.episodeSummary,
      url: `https://podverse.fm/episodes/alias?mediaURL=${mediaRef.episodeMediaURL}`,
      guid: uuid(),
      // categories: ,
      author: mediaRef.podcastTitle, // TODO: should be real author listed in feed
      date: mediaRef.episodePubDate,
      enclosure: {
        url: mediaRef.episodeMediaURL,
        // file: ,
        // size: ,
        // mime
      },
      // we need to set itunesSummary to an empty string, or podcastRSS
      // will automatically fill it out
      itunesSummary: ' ',
      itunesDuration: mediaRef.episodeDuration,
      itunesImage: mediaRef.episodeImageURL || mediaRef.podcastImageURL
      // other options
      // itunesAuthor: '',
      // itunesSubtitle: '',
      // itunesOwner: '',
      // itunesExplicit: '',
      // itunesKeywords: ''
    };
    feed.item(itemOptions)
  }

  return feed;
}

module.exports = {generatePlaylistRSSFeed};
