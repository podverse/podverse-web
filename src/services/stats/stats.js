let config = require('config.js'),
    {dateInServersTimezone, lastHourInServersTimezone} = require('util.js'),
    {queryGoogleApiData} = require('services/googleapi/googleapi.js');

// Retrieves the unique pageview counts for the specified page path.
// Sample pagePaths: '~/episodes' or '~/clips'
function queryUniquePageviewsFromPastHour(pagePath) {
  // startDate and endDate must be in yyyy-mm-dd string format
  let startIndexOffset,
      startDate = dateInServersTimezone(-60), // offset by minus 1 hour
      lastHour = parseInt(lastHourInServersTimezone()) + 1;

  let queryObj = {
    metrics: 'ga:uniquePageviews',
    dimensions: ['ga:pagePath', 'ga:date'],
    startDate: startDate,
    endDate: startDate,
    sort: '-ga:uniquePageviews',
    maxResults: 10000, // maximum Google's API allows is 10000,
    startIndex: startIndexOffset || 1,
    filters: `ga:pagePath=${pagePath};ga:hour==${lastHour};ga:uniquePageviews>0`
  };

  return new Promise((resolve, reject) => {
    queryGoogleApiData(resolve, reject, queryObj)
  })
  .then(data => {
    console.log('data', data);
    console.log('rows:', data.rows);
  })
  .catch(err => {
    console.log(err);
  });

}

module.exports = {
  queryUniquePageviewsFromPastHour
};
