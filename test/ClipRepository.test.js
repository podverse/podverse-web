"use strict";

const
  expect = require('chai').expect,
  chance = require('chance').Chance(),

  Datastore = require('nedb'),
  clipsDb = new Datastore(),

  ClipRepository = require('../ClipRepository.js');


describe('ClipRepository', function () {
  let clipRepo;

  beforeEach(function () {
    clipRepo = new ClipRepository(clipsDb);
  });

  it('should do something', function (done) {
    var testClip = {name: chance.name()};

    clipRepo.createClip(testClip)

      .then(clipId =>
        clipRepo.getClip(clipId)
      )

      .then(clip => {
        expect(clip.name).to.equal(testClip.name)
        done();
      })

      .catch(done);

  });

});
