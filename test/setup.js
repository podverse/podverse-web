const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
global.chai = chai;
global.expect = chai.expect;
chai.use(chaiHttp);
