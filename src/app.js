const
    appFactory = require('./appFactory'),
    sqlEngineFactory = require('./repositories/sequelize/engineFactory.js'),
    modelFactory = require('./repositories/sequelize/models'),
    {locator} = require('./locator'),
    {dbConfig} = require('./config');

const sqlEngine = new sqlEngineFactory(dbConfig);
locator.set('sqlEngine', sqlEngine);
locator.set('Models', modelFactory(sqlEngine));

const
    ClipService = require('./services/clip/ClipService'),
    PlaylistService = require('./services/playlist/PlaylistService'),
    UserService = require('./services/user/UserService');

const
    PodcastService = require('podcast-db/src/services/podcast/PodcastService'),
    EpisodeService = require('podcast-db/src/services/episode/EpisodeService'),
    FeedUrlService = require('podcast-db/src/services/feedUrl/FeedUrlService');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new PlaylistService());
locator.set('PodcastService', new PodcastService());
locator.set('EpisodeService', new EpisodeService());
locator.set('FeedUrlService', new FeedUrlService());
locator.set('UserService', new UserService());

module.exports = appFactory();
