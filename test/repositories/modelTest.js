'use strict';

const sqlEngineFactory = require('repositories/sequelize/engineFactory.js'),
  registerModels = require('repositories/sequelize/models');

describe('When loading all models to sequelize', function () {

  beforeEach(function () {
    const sqlEngine = sqlEngineFactory();
    this.models = registerModels(sqlEngine);
  });

  it('should have the the expected models available', function () {
    ['Podcast', 'MediaRef', 'Playlist', 'Episode']
      .forEach(name =>
        expect(this.models[name]).to.be.ok);
  });

});
