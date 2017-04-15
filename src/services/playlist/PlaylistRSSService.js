const
    PodcastRSS = require('podcast'),
    uuid = require('uuid'),
    _ = require('lodash'),
    { convertSecToHHMMSS, readableDate } = require('../../util.js');

let generatePlaylistRSSFeed = (playlist) => {

  // Some podcast players do not use the image set in the item.itunesImage,
  // so instead we are using a Podverse default logo.
  // let podcastImageURL = `${
  //   playlist.mediaRefs.length > 0 ?
  //   playlist.mediaRefs[0].podcastImageURL :
  //   'https://podverse.fm/static/images/podverse-logo-1024.png'
  // }`;

  let title, description;
  if (playlist.isRecommendation) {
    playlist.ownerName = playlist.ownerName ? playlist.ownerName : 'anonymous';
    title = `Playlist: From ${playlist.ownerName}`;
    description = `Playlist of recommended episodes and clips for ${playlist.title} from ${playlist.ownerName}. <br><br>`+
                  `Created with podverse.fm`;
  } else {
    playlist.ownerName = playlist.ownerName ? playlist.ownerName : 'anonymous';
    title = `${playlist.title}`;
    description = `Playlist of recommended episodes and clips by ${playlist.ownerName}. <br><br>`+
                  `Created with podverse.fm`;
  }

  // Use the most recent mediaRef.lastUpdated value as the lastBuildDate for
  // the RSS feed.

  let lastMR = lastMediaRefUpdatedOverall = _.maxBy(playlist.mediaRefs, (mR) => { return mR.lastUpdated });
  let lastBuildDate = lastMR.lastUpdated;

  const feedOptions = {
    lastBuildDate: new Date(lastBuildDate).toUTCString(),
    title: title,
    description: description,
    generator: 'podverse.fm',
    feed_url: `https://podverse.fm/playlists/${playlist.id}?rssFeed`,
    site_url: `https://podverse.fm/playlists/${playlist.id}`,
    image_url: 'https://podverse.fm/static/images/podverse-logo-1024.png',
    docs: 'https://podverse.fm/about',
    author: playlist.ownerName,
    managingEditor: playlist.ownerName,
    webMaster: playlist.ownerName,
    copyright: 'AGPLv3',
    language: 'English',
    categories: ['playlists'],
    pubDate: playlist.lastUpdated,
    // TODO: do we want to set ttl?
    // ttl: '', // number of minutes feed can be cached before refreshing from source

    itunesSummary: description, //,
    itunesImage: 'https://podverse.fm/static/images/podverse-logo-1024.png'
    // other options
    // itunesAuthor: '', // playlist.ownerName,
    // itunesSubtitle: '', // 'Created with podverse.fm',
    // itunesOwner: '', // playlist.ownerName,
    // itunesExplicit: '',
    // itunesCategories: ''
  }

  const feed = new PodcastRSS(feedOptions);

  let groupedMediaRefs = _.groupBy(playlist.mediaRefs, 'episodeMediaURL');
  let formattedMediaRefs = [];

  Object.keys(groupedMediaRefs).forEach(key => {
    let mediaRefs = groupedMediaRefs[key];

    let fMediaRef = formattedMediaRef = {};
    fMediaRef.episodeTitle = mediaRefs[0].episodeTitle;
    fMediaRef.episodeMediaURL = mediaRefs[0].episodeMediaURL;
    fMediaRef.podcastTitle = mediaRefs[0].podcastTitle;
    fMediaRef.episodePubDate = mediaRefs[0].episodePubDate;
    fMediaRef.episodeMediaURL = mediaRefs[0].episodeMediaURL;
    fMediaRef.episodeDuration = mediaRefs[0].episodeDuration;
    fMediaRef.episodeImageURL = mediaRefs[0].episodeImageURL;
    fMediaRef.podcastImageURL = mediaRefs[0].podcastImageURL;

    let lastMediaRefUpdated = _.maxBy(mediaRefs, (mR) => { return mR.lastUpdated });
    fMediaRef.lastUpdated = lastMediaRefUpdated.lastUpdated;

    fMediaRef.description = '';

    mediaRefs = _.sortBy(mediaRefs, 'startTime');

    let desc = `<b>${mediaRefs[0].podcastTitle}</b><br><br> `;
    let readableEpisodePubDate = readableDate(mediaRefs[0].episodePubDate);
    desc += `(Episode from ${readableEpisodePubDate})<br><br><hr> `

    let hasClip = _.some(mediaRefs, (m) => {
      if (m.startTime > 0 || m.endTime > 0) {
        return true;
      }
    });

    if (hasClip) {
      desc += `<br><b>${mediaRefs.length > 1 ? 'Clips' : 'Clip'} shared with you:</b> <br><br>`;
      for (let [index, mediaRef] of mediaRefs.entries()) {
        let startTime = convertSecToHHMMSS(mediaRef.startTime);
        let endTime = convertSecToHHMMSS(mediaRef.endTime);
        let timeString = '';
        if (mediaRef.startTime < mediaRef.endTime) {
          timeString = `${startTime} – ${endTime}`;
        } else {
          timeString = `${startTime} start time`;
        }
        let title = mediaRef.title ? mediaRef.title : 'untitled clip';
        desc += `${timeString}: ${title}<br><br>`;
      }

      desc += '<hr><br>';
    }

    if (mediaRefs[0] && mediaRefs[0].episodeSummary) {
      desc += mediaRefs[0].episodeSummary;
    }

    fMediaRef.description = desc;

    formattedMediaRefs.push(formattedMediaRef)
  });

  formattedMediaRefs = _.sortBy(formattedMediaRefs, 'lastUpdated').reverse();

  for (let mediaRef of formattedMediaRefs) {
    let securePodcastImageURL;
    if (mediaRef.podcastImageURL) {
      securePodcastImageURL = mediaRef.podcastImageURL.substr(mediaRef.podcastImageURL.indexOf('://') + 3);
      securePodcastImageURL = 'https://' + securePodcastImageURL;
    }

    let itemOptions = {
      title: mediaRef.episodeTitle,
      description: mediaRef.description,
      url: `https://podverse.fm/episodes/alias?mediaURL=${mediaRef.episodeMediaURL}`,
      // guid: uuid(),
      // categories: ,
      author: mediaRef.podcastTitle, // TODO: should be real author listed in feed
      date: mediaRef.lastUpdated,
      enclosure: {
        url: mediaRef.episodeMediaURL,
        // file: ,
        // size: ,
        // mime
      },
      // we need to set itunesSummary to an empty string, or podcastRSS
      // will automatically fill it out
      itunesSummary: mediaRef.description,
      itunesDuration: mediaRef.episodeDuration,
      itunesImage: securePodcastImageURL
      // other options
      // itunesAuthor: '',
      // itunesSubtitle: '',
      // itunesOwner: '',
      // itunesExplicit: '',
      // itunesKeywords: ''
    };
    feed.item(itemOptions)
  }

  let xml = feed.xml(' '); // ' ' sets format to 2-space tabs

  return xml;
}

module.exports = {generatePlaylistRSSFeed};
