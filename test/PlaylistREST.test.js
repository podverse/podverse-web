"use strict";

var chai = require('chai'),
  chaiHttp = require('chai-http');
  chai.use(chaiHttp);

var expect = chai.expect;

var feathers = require('feathers'),
  bodyParser = require('body-parser'),
  NeDB = require('nedb'),
  PlaylistService = require('../PlaylistService.js');

describe('Playlist Endpoint', function () {
  let responseBody;

  beforeEach(function () {
    this.db = new NeDB();
    this.app = feathers();
    this.app.configure(feathers.rest());
    this.app.use(bodyParser.json());

    this.app.use('/pl', new PlaylistService({Model: this.db}));

  });

  describe('POST Playlist', function () {


    beforeEach(function (done) {
      let playlist = {
        _slug: 'test',
        title: 'TITLE',
        items: [],
        _id: 'sentId'
      };

      chai.request(this.app)
        .post('/pl')
        .send(playlist)
        .then(res=>{
          responseBody = res.body
          done();
        })
        .catch(err=>done(err));
    });

    it('should work', function () {
      expect(responseBody._slug).to.equal('test');
    });

    it('should contain the url', function () {
      expect(responseBody.url).to.contain('/pl/test')
    });

    it('should have the playlist available via slug', function (done) {
      chai.request(this.app)
        .get('/pl/test')
        .then(res=> {
          expect(res.body._slug).to.be.ok;
          done();
        })
        .catch(e=>done(e));
    });

  });

  describe('PUT Playlist without slug', function () {
    let responseCode;

    beforeEach(function (done) {
      this.db.insert({
        _slug: 'hooHa-playlist', items: []
      }, (err) => done(err));
    });

    beforeEach(function (done) {

      let playlist = {
        title: 'TITLE',
        items: [],
        _id: 'sentId'
      };

      chai.request(this.app)
        .put('/pl')
        .send(playlist)
        .then(res=> {
          responseCode = res.statusCode
          done();
        })
        .catch(err=>{
          responseCode = err.status;
          done();
        });

    });

    it('should not allow this', function () {
      expect(responseCode).to.be.above(399);
    });

  });


  describe('PUT Playlist for updating', function () {

    beforeEach(function (done) {
      this.db.insert({
        _slug: 'hooHa-playlist', items: []
      }, (err) => done(err));
    });

    beforeEach(function (done) {

      let playlist = {
        _slug: null,
        title: 'TITLE',
        items: [],
        _id: 'sentId'
      };

      chai.request(this.app)
        .put('/pl/hooHa-playlist')
        .send(playlist)
        .then(res=> {
          responseBody = res.body
          done();
        })
        .catch(err=>done(err));

    });

    it('should not return an array', function () {
      expect(responseBody.length).not.to.be.ok;
    });

    it('should not consider the given id', function () {
      expect(responseBody._id).not.to.equal('sentId');
    });
  });

  describe('PUT Playlist that doesnt already exist', function () {

    beforeEach(function (done) {

      let playlist = {
        title: 'TITLE',
        items: [],
        _id: 'sentId'
      };

      chai.request(this.app)
        .put('/pl/hooHa-playlist')
        .send(playlist)
        .then(res=> {

          responseBody = res.body
          done();
        })
        .catch(err=>done(err));

    });

    it('should have modified the slug accordingly', function () {
      expect(responseBody._slug).to.equal('hooHa-playlist');
    });

    it('should not consider the given id', function () {
      expect(responseBody._id).not.to.equal('sentId');
    });
  });

});
