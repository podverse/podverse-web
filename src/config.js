"use strict";

const jwtSigningKeyB64 = process.env.jwtSigningKeyB64 || 'RhvV5pbdUOHL0Rns4mX9YgCZ23kvoLqlB6eFau-QIXkxjK4Tx4qFISuzCOg4lmR_';

let isProd = process.env.NODE_ENV === 'production';

module.exports = {
  port: process.env.PORT || 8080,
  baseURL: process.env.baseURL || 'http://localhost:8080',
  jwtSigningKey: new Buffer(jwtSigningKeyB64, 'base64'),
  sqlite: process.env.sqlite || './data/podverseWeb.sqlite',
  databaseName: 'podverse',

  // TODO: change the auth0 values to podverse.fm's clientId and domain before deployment
  auth0ClientId: process.env.auth0ClientId || 'tTGQrl5CenMDdpzcKNpmLIginyRgBJNN',
  auth0Domain: process.env.auth0Domain || 'mitchd.auth0.com',

  googleAnalyticsUA: isProd ? 'UA-87988078-1' : '',

  ga: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY,
    view_id: 'ga:134581781'
  }
};
