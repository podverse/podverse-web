const
    appFactory = require('./appFactory'),
    sqlEngineFactory = require('repositories/sequelize/engineFactory.js'),
    modelFactory = require('repositories/sequelize/models'),
    {locator} = require('locator.js');

// TODO: I DON'T THINK THIS SHOULD BE HARDCODED HERE, MAYBE WE SHOULD BE CONDITIONALLY
// PASSING IN VALUES FOR LOCAL & DEV & PROD?
const sqlEngine = new sqlEngineFactory({uri: 'postgres://postgres:password@127.0.0.1:5432/podverse'});
locator.set('Models', modelFactory(sqlEngine));

const
    ClipService = require('services/clip/ClipService.js'),
    PlaylistService = require('services/playlist/PlaylistService.js'),
    UserService = require('services/user/UserService.js');

const
    PodcastService = require('podcast-db/src/services/podcast/PodcastService.js'),
    EpisodeService = require('podcast-db/src/services/episode/EpisodeService.js');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new PlaylistService());
locator.set('PodcastService', new PodcastService());
locator.set('EpisodeService', new EpisodeService());
locator.set('UserService', new UserService());

module.exports = appFactory();
