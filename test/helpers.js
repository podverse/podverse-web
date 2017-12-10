const
    SqlEngine = require('repositories/sequelize/engineFactory'),
    registerModels = require('repositories/sequelize/models'),
    registerPodcastDbModels = require('../node_modules/podcast-db/src/repositories/sequelize/models'),
    {locator} = require('locator.js'),
    appFactory = require('appFactory.js'),
    PodcastService = require('podcast-db/src/services/podcast/PodcastService.js'),
    EpisodeService = require('podcast-db/src/services/episode/EpisodeService.js'),
    PlaylistService = require('services/playlist/PlaylistService.js'),
    ClipService = require('services/clip/ClipService.js'),
    UserService = require('services/user/UserService.js'),
    nJwt = require('njwt'),
    {postgresUri, jwtSigningKey} = require('config.js'),
    isCi = require('is-ci');

function configureDatabaseModels (resolve) {

  beforeEach(function (done) {
    this._sqlEngine = new SqlEngine({uri: postgresUri});
    const Models = registerModels(this._sqlEngine);
    const podcastDbModels = registerPodcastDbModels(this._sqlEngine);

    this._sqlEngine.sync()
      .then(() => {
        locator.set('Models', Models);
        locator.set('sqlEngine', this._sqlEngine);
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
      episodeMediaUrl: 'http://some.mediaURL.com'
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

function createTestPodcastAndEpisode () {

  return new Promise((resolve, reject) => {
    let podcastService = new PodcastService(),
        episodeService = new EpisodeService();

    return podcastService.create({
      feedUrl: 'http://example.com/test333',
      title: 'Most interesting podcast in the world',
      imageUrl: 'http://example.com/image.jpg'
    }, {})
    .then(podcast => {
      this.podcast = podcast;
      return episodeService.create({
        mediaUrl: 'http://example.com/test999',
        feedUrl: 'http://example.com/test333',
        title: 'Best episode in the history of time',
        podcastId: this.podcast.id,
        pubDate: '2017-01-30T03:58:46+00:00'
      }, {});
    })
    .then(episode1 => {
      this.episode1 = episode1;
      return episodeService.create({
        mediaUrl: 'http://example.com/test2222',
        feedUrl: 'http://example.com/test333',
        title: 'Oldest episode in the history of time',
        podcastId: this.podcast.id,
        pubDate: '1999-12-31T23:59:59+00:00'
      }, {});
    })
    .then(episode2 => {
      resolve([this.podcast, this.episode1, episode2]);
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
  createTestPodcastAndEpisode
};
