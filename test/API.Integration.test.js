"use strict";

var chai = require('chai'),
  chaiHttp = require('chai-http');
  chai.use(chaiHttp);

var expect = chai.expect;

var
  app = require('../app.js'),
  config = require('../config.js');

describe('API Integration Tests', function () {

  beforeEach(function () {
    this.app = app;
  });

  describe('POST Clip should reject without secret', function () {

    beforeEach(function (done) {

      let playlist = {
        name: 'foo'
      };

      chai.request(this.app)
        .post('/c')
        .send(playlist)
        .then(() => done())
        .catch(err=>{
          this.error = err;
          done();
        });
    });

    it('should return Unauthorized', function () {
      expect(this.error.message).to.contain('Unauthorized');
    });

  });

  describe('POST Playlist should reject without secret', function () {

    beforeEach(function (done) {

      let playlist = {
        name: 'foo'
      };

      chai.request(this.app)
        .post('/pl')
        .send(playlist)
        .then(() => done())
        .catch(err=>{
          this.error = err;
          done();
        });
    });

    it('should return Unauthorized', function () {
      expect(this.error.message).to.contain('Unauthorized');
    });

  });

  describe('PUT Playlist should reject without secret', function () {

    beforeEach(function (done) {

      let playlist = {
        name: 'foo'
      };

      chai.request(this.app)
        .post('/pl')
        .send(playlist)
        .then(() => done())
        .catch(err=>{
          this.error = err;
          done();
        });
    });

    it('should return Unauthorized', function () {
      expect(this.error.message).to.contain('Unauthorized');
    });

  });

  describe('POST Clip', function () {

    beforeEach(function (done) {

      let playlist = {
        name: 'foo'
      };

      chai.request(this.app)
        .post('/c')
        .set('Authorization', config.apiSecret)
        .send(playlist)
        .then(res=>{
          this.res = res;
          done();
        })
        .catch(err=>done(err));
    });

    it('should work', function () {
      expect(this.res.statusCode).to.equal(201);
    });

  });

  describe('POST Playlist', function () {

    beforeEach(function (done) {

      let playlist = {
        name: 'foo'
      };

      chai.request(this.app)
        .post('/pl')
        .set('Authorization', config.apiSecret)
        .send(playlist)
        .then(res=>{
          this.res = res;
          done();
        })
        .catch(err=>done(err));
    });

    it('should work', function () {
      expect(this.res.statusCode).to.equal(201);
    });

  });

  describe('PUT Playlist', function () {

    beforeEach(function (done) {

      let playlist = {
        name: 'foo'
      };

      chai.request(this.app)
        .put('/pl/foo')
        .set('Authorization', config.apiSecret)
        .send(playlist)
        .then(res=>{
          this.res = res;
          done();
        })
        .catch(err=>done(err));
    });

    it('should work', function () {
      expect(this.res.statusCode).to.equal(200);
    });

  });

});
