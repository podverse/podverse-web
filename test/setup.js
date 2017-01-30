const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiDateTime = require('chai-datetime');
const chance = require('chance');
const sinon = require('sinon');

require('./hooksVerifiers.js');
chai.should();


global.rewire = require('rewire');
global.chai = chai;
global.expect = chai.expect;
global.chance = chance.Chance();

chai.use(chaiHttp);
chai.use(chaiDateTime);

// Spy sandboxing
beforeEach(function () {
  this.sinon = sinon.sandbox.create();
});

afterEach(function () {
  this.sinon.restore();
});
