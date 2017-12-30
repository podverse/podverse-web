const
    appFactory = require('./appFactory'),
    sqlEngineFactory = require('repositories/sequelize/engineFactory.js'),
    modelFactory = require('repositories/sequelize/models'),
    {locator} = require('locator.js'),
    {postgresUri} = require('config');

const sqlEngine = new sqlEngineFactory({uri: postgresUri});
locator.set('sqlEngine', sqlEngine);
locator.set('Models', modelFactory(sqlEngine));

const
    ClipService = require('services/clip/ClipService.js'),
    PlaylistService = require('services/playlist/PlaylistService.js'),
    UserService = require('services/user/UserService.js');

const
    PodcastService = require('podcast-db/src/services/podcast/PodcastService.js'),
    EpisodeService = require('podcast-db/src/services/episode/EpisodeService.js'),
    FeedUrlService = require('podcast-db/src/services/feedUrl/FeedUrlService.js');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new PlaylistService());
locator.set('PodcastService', new PodcastService());
locator.set('EpisodeService', new EpisodeService());
locator.set('FeedUrlService', new FeedUrlService());
locator.set('UserService', new UserService());

module.exports = appFactory();
