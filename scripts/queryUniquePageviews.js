#!/usr/local/bin/node
let path = require('path');
let pagePath = process.argv[2];
let timeRange = process.argv[3];

require(path.join(__dirname, '../src/', 'stats.js')).queryUniquePageviews(pagePath, timeRange);
