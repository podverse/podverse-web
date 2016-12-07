let config = require('config.js');

function queryGoogleApiData(resolve, reject, queryObj) {
  let google = require('googleapis');
  let analytics = google.analytics('v3');

  let key = require('My Project-8172a1e558d9.json');
  let VIEW_ID = config.googleAnalyticsViewId;

  let jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/analytics.readonly'],
    null
  );

  jwtClient.authorize((err, tokens) => {
    if (err) {
      reject(err);
    }

    analytics.data.ga.get({
      'auth': jwtClient,
      'ids': VIEW_ID,
      'metrics': queryObj.metrics,
      'dimensions': queryObj.dimensions,
      'start-date': queryObj.startDate,
      'end-date': queryObj.endDate,
      'sort': queryObj.sort,
      'max-results': queryObj.maxResults,
      'start-index': queryObj.startIndex,
      'filters': queryObj.filters
    }, function (err, response) {
      if (err) {
        reject(err);
      }

      resolve(response.rows);
    });
  });
}


module.exports = {
  queryGoogleApiData
};
