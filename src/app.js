const
    {sqlite} = require('src/config.js'),
    appFactory = require('./appFactory'),
    sqlEngineFactory = require('repositories/sequelize/engineFactory.js'),
    modelFactory = require('repositories/sequelize/models'),
    {locator} = require('locator.js');

const sqlEngine = new sqlEngineFactory({storagePath: sqlite});
locator.set('Models', modelFactory(sqlEngine));

const
    ClipService = require('services/clip/ClipService.js'),
    PlaylistService = require('services/playlist/PlaylistService.js'),
    PodcastService = require('services/podcast/PodcastService.js'),
    EpisodeService = require('services/episode/EpisodeService.js'),
    UserService = require('services/user/UserService.js');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new PlaylistService());
locator.set('PodcastService', new PodcastService());
locator.set('EpisodeService', new EpisodeService());
locator.set('UserService', new UserService());

module.exports = appFactory();
