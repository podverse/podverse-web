"use strict";

const isCi = require('is-ci');

const jwtSigningKeyB64 = process.env.jwtSigningKeyB64 || 'RhvV5pbdUOHL0Rns4mX9YgCZ23kvoLqlB6eFau-QIXkxjK4Tx4qFISuzCOg4lmR_';
let postgresUri;

module.exports = {
  port: process.env.PORT || 8080,
  baseURL: process.env.baseURL || 'http://localhost:8080',
  jwtSigningKey: new Buffer(jwtSigningKeyB64, 'base64'),
  databaseName: 'postgres',
  postgresUri: process.env.postgresUri || 'postgres://postgres:password@127.0.0.1:5432/postgres',

  // TODO: change the auth0 values to podverse.fm's clientId and domain before deployment
  auth0ClientId: process.env.auth0ClientId || 'tTGQrl5CenMDdpzcKNpmLIginyRgBJNN',
  auth0Domain: process.env.auth0Domain || 'mitchd.auth0.com',

  googleAnalyticsUA: 'UA-87988078-1',

  ga: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY,
    view_id: 'ga:134581781'
  }

};
