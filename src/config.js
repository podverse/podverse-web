"use strict";

const isCi = require('is-ci');

const jwtSigningKeyB64 = process.env.jwtSigningKeyB64 || 'RhvV5pbdUOHL0Rns4mX9YgCZ23kvoLqlB6eFau-QIXkxjK4Tx4qFISuzCOg4lmR_';
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_DATABASE || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'mysecretpw',
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: process.env.DB_LOGGING || false
};

module.exports = {
  dbConfig,
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 8080,
  baseUrl: process.env.baseUrl || 'http://localhost:8080',
  jwtSigningKey: new Buffer(jwtSigningKeyB64, 'base64'),
  // TODO: change the auth0 values to podverse.fm's clientId and domain before deployment
  auth0ClientId: process.env.auth0ClientId || 'tTGQrl5CenMDdpzcKNpmLIginyRgBJNN',
  auth0Domain: process.env.auth0Domain || 'mitchd.auth0.com',

  googleAnalyticsUA: (process.env.NODE_ENV === 'production') ? 'UA-87988078-1' : '',

  ga: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY,
    view_id: 'ga:134581781'
  }

};
