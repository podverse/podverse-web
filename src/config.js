"use strict";

module.exports = {
  port: process.env.PORT || 8080,
  baseURL: process.env.baseURL || 'http://localhost:8080',
  jwtSigningKey: new Buffer('RhvV5pbdUOHL0Rns4mX9YgCZ23kvoLqlB6eFau-QIXkxjK4Tx4qFISuzCOg4lmR_', 'base64'),
  sqlite: './data/podverseWeb.sqlite',
  databaseName: 'podverse'
};
