"use strict";

const isCi = require('is-ci');

const jwtSigningKey = process.env.jwtSigningKey ? new Buffer(process.env.jwtSigningKey, 'base64') : '' ;

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_DATABASE || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: process.env.DB_LOGGING || false
};

module.exports = {
  dbConfig,
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 8080,
  baseUrl: process.env.baseUrl || 'http://localhost:8080',
  jwtSigningKey,
  auth0ClientId: process.env.auth0ClientId,
  auth0Domain: process.env.auth0Domain,
  googleAnalyticsUA: (process.env.NODE_ENV === 'production') ? '' : '',
  ga: {
    view_id: ''
  }
};
