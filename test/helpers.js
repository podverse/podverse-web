const
    SqlEngine = require('../src/repositories/sequelize/engineFactory.js'),
    registerModels = require('../src/repositories/sequelize/models/'),
    registerPodcastDbModels = require('../node_modules/podcast-db/src/repositories/sequelize/models/'),
    {locator} = require('../src/locator.js'),
    appFactory = require('../src/appFactory.js'),
    PlaylistService = require('../src/services/playlist/PlaylistService.js'),
    ClipService = require('../src/services/clip/ClipService.js'),
    UserService = require('../src/services/user/UserService.js'),
    PodcastService = require('podcast-db/src/services/podcast/PodcastService.js'),
    EpisodeService = require('podcast-db/src/services/episode/EpisodeService.js'),
    FeedUrlService = require('podcast-db/src/services/feedUrl/FeedUrlService.js'),
    nJwt = require('njwt'),
    {dbConfig, jwtSigningKey} = require('../src/config.js'),
    isCi = require('is-ci');

function configureDatabaseModels (resolve) {

  beforeEach(function (done) {
    this._sqlEngine = new SqlEngine(dbConfig);

    const Models = registerModels(this._sqlEngine);
    const podcastDbModels = registerPodcastDbModels(this._sqlEngine);
    
    this._sqlEngine.sync()
      .then(() => {
        locator.set('sqlEngine', this._sqlEngine);
        locator.set('Models', Models);
        resolve.apply(this, [Models]);
        done();
      });
  });

  afterEach(function (done) {
    locator.set('Models', undefined);
    this._sqlEngine.drop()
      .then(() => done());
  });
}

function createTestApp (Models) {
  locator.set('PlaylistService', new PlaylistService());
  locator.set('ClipService', new ClipService());
  locator.set('PodcastService', new PodcastService());
  locator.set('EpisodeService', new EpisodeService());
  locator.set('FeedUrlService', new FeedUrlService());
  locator.set('UserService', new UserService());
  return appFactory();
}

function createValidTestJWT () {
  const userId = 'kungfury@podverse.fm'

  const claims = {
    iss: 'http://localhost:8080',
    sub: userId
  };

  const jwt = nJwt.create(claims, jwtSigningKey);
  jwt.setExpiration(); // Never expire why not
  const token = jwt.compact();

  return token
}

function createTestUser (Models) {

  const {User} = Models;

  return Promise.resolve(User.create({
    id: 'kungfury@podverse.fm'
  }));
}

function createTestMediaRefs (Models) {

  const {MediaRef} = Models;

  let mediaRefs = [];
  for (let i = 0; i < 4; i++) {
    let mediaRef = {
      ownerId: 'testOwner',
      episodeId: 'someId',
      title: `TestTitle${i}`,
      podcastFeedUrl: 'http://some.rss.feed.com',
      episodeMediaUrl: 'http://some.mediaURL.com',
      podcastId: 'some-podcast-id'
    }
    mediaRefs.push(mediaRef);
  }

  return Promise.all([
    MediaRef.create(mediaRefs[0]),
    MediaRef.create(mediaRefs[1]),
    MediaRef.create(mediaRefs[2]),
    MediaRef.create(mediaRefs[3])
  ]);

}

function createTestPlaylist (Models) {

  const {Playlist} = Models;

  const playlistSvc = new PlaylistService({Models: Models});

  return createTestMediaRefs(Models)
    .then(mediaRefs => {
      return createTestUser(Models)
        .then(user => {
          return playlistSvc.create({
            'title': 'Playlist Title',
            'slug': 'playlist-slug',
            'ownerId': 'kungfury@podverse.fm',
            'playlistItems': [mediaRefs[0], mediaRefs[1]]
          });
        })
    });
}

function createTestPodcastAndEpisodeAndFeedUrl () {

  return new Promise((resolve, reject) => {
    let podcastService = new PodcastService(),
        episodeService = new EpisodeService(),
        feedUrlService = new FeedUrlService();

    return podcastService.create({
      imageUrl: 'http://example.com/image.jpg',
      title: 'Most interesting podcast in the world'
    }, {})
    .then(podcast => {
      this.podcast = podcast;
      return episodeService.create({
        mediaUrl: 'http://something.com/1.mp3',
        title: 'Best episode ever',
        podcastId: this.podcast.id,
        pubDate: '2017-01-30T03:58:46+00:00'
      }, {});
    })
    .then(episode1 => {
      this.episode1 = episode1;
      return episodeService.create({
        mediaUrl: 'http://example.com/999.ogg',
        title: 'Oldest episode in the history of time',
        podcastId: this.podcast.id,
        pubDate: '1999-12-31T23:59:59+00:00'
      }, {});
    })
    .then(episode2 => {
      this.episode2 = episode2;
      return feedUrlService.create({
        url: 'http://something.com/rss',
        isAuthority: true,
        podcastId: this.podcast.id
      }, {});
    })
    .then(feedUrl => {
      resolve([this.podcast, this.episode1, feedUrl, this.podcast.id]);
    })
    .catch(e => {
      reject(e);
    });
  })

}

module.exports = {
  configureDatabaseModels,
  createTestApp,
  createValidTestJWT,
  createTestPlaylist,
  createTestMediaRefs,
  createTestUser,
  createTestPodcastAndEpisodeAndFeedUrl
};
