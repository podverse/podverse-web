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

  it('should be able to list clips by userId', function (done) {

    let name = chance.name();

    function insertStubIntoDb () {
      return new Promise (res => {
        clipsDb.insert({clip:{userId: name}}, (err, c) => {res(c);});
      });
    }

    let insertStubsIntoDb = insertStubIntoDb();

    for(let i = 0; i < 5-1; i++) {
      insertStubsIntoDb = insertStubsIntoDb.then(insertStubIntoDb);
    }

    insertStubsIntoDb.then(() => {

      clipRepo.getClipsByUserId(name)
        .then(clips => {
          expect(clips.length).to.equal(5);
          done();
        })
        .catch(done);

    });



  });

  it('should be able to create a clip', function (done) {
    var testClip = {name: chance.name()};

    clipRepo.createClip(testClip)

      .then(clipId =>
        clipRepo.getClip(clipId)
      )

      .then(clip => {
        expect(clip.name).to.equal(testClip.name);
        done();
      })

      .catch(done);

  });

});
