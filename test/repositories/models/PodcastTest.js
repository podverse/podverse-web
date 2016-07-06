'use strict';

const sqlEngineFactory = require('repositories/sequelize/engineFactory.js'),
  registerModels = require('repositories/sequelize/models');

describe('Podcast Model ', function () {

  beforeEach(function (done) {

    const sqlEngine = sqlEngineFactory();
    this.models = registerModels(sqlEngine);
    this.Podcast = this.models.Podcast;

    sqlEngine.sync()
      .then(() => done());

  });

  it('should successfully create/retrieve', function () {

    this.Podcast.create({
      'feedURL' : 'https://foo.com/jolly'
    })

    .then(() => {
      this.Podcast.findAll()
        .then(podcasts =>{
          let firstPodcast = podcasts[0];

          expect(firstPodcast.feedURL)
            .to.equal('https://foo.com/jolly')
        });
    });




  });

});
