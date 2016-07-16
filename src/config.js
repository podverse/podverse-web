"use strict";

module.exports = {
  port: process.env.PORT || 9000,
  baseURL: process.env.baseURL || 'http://localhost:9000',
  apiSecret: 'wide-open',
  sqlite: './data/podverseWeb.sqlite',
  databaseName: 'podverse'
};
