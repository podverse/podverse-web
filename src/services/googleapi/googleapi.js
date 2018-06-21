'use strict';

let path = require('path');
let config = require('../../config.js');
const { google } = require('googleapis');

async function queryGoogleApiData (resolve, reject, queryObj) {

  try {
    const client = await google.auth.getClient({
      keyFile: path.join(__dirname, 'jwt.keys.json'),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });
  
    const analytics = google.analyticsreporting({
      version: 'v4',
      auth: client
    });
    
    analytics.reports.batchGet({
      resource: {
        reportRequests: [{
          dateRanges: [
            {
              startDate: queryObj.startDate,
              endDate: queryObj.endDate
            }
          ],
          dimensions: [
            {
              name: 'ga:pagePath'
            }
          ],
          filtersExpression: queryObj.filters,
          metrics: [
            {
              expression: 'ga:uniquePageviews'
            }
          ],
          orderBys: [
            {
              "sortOrder": 'DESCENDING',
              "fieldName": "ga:uniquePageviews"
            }
          ],
          pageSize: 10000,
          viewId: config.ga.view_id
        }]
      }
    }, null, (error, response) => {
      resolve(response.data.reports[0].data);
    });

  } catch (err) {
    console.log('queryGoogleApiData catch');
    console.log(err);
    reject(err);
  }

}

module.exports = {
  queryGoogleApiData
};