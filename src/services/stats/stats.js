let config = require('config.js'),
      {offsetDate, lastHour} = require('util.js'),
    {queryGoogleApiData} = require('services/googleapi/googleapi.js');
//     ClipService = require('services/clip/ClipService.js');
//
// ClipService = new ClipService();

// Retrieves the unique pageview counts for the specified page path.
// Sample pagePaths: '~/episodes' or '~/clips'
function queryUniquePageviews(timeRange, pagePath, startIndexOffset=0) {

  // This seems dangerous because it could get into an infinite loop. But the
  // increasing startIndexOffset should eventually result in data.rows.count
  // returning 0. TODO: is there a better way to do this?
  let startDateOffset; // in minutes

  if (timeRange === 'pastHourTotalUniquePageviews') {
    startDateOffset = -60;
  } else if (timeRange === 'pastDayTotalUniquePageviews') {
    startDateOffset = -1440;
  } else if (timeRange === 'pastWeekTotalUniquePageviews') {
    startDateOffset = -10080;
  } else if (timeRange === 'pastMonthTotalUniquePageviews') {
    startDateOffset = -43800;
  } else if (timeRange === 'pastYearTotalUniquePageviews') {
    startDateOffset = -525600;
  } else if (timeRange === 'allTimeTotalUniquePageviews') {
    // logic handled when the startDate variable is created
  } else {
    console.log('A valid timeRange must be provided in the first parameter.');
    console.log('Valid options are: pastHourTotalUniquePageviews, pastDayTotalUniquePageviews, pastWeekTotalUniquePageviews, pastMonthTotalUniquePageviews, pastYearTotalUniquePageviews, allTimeTotalUniquePageviews');
    return;
  }

  // startDate and endDate must be in yyyy-mm-dd string format
  let startDate = timeRange === 'allTimeTotalUniquePageviews' ? '2017-01-01' : offsetDate(startDateOffset);
  let hourFilter = timeRange === 'pastHourTotalUniquePageviews' ? `ga:hour==${lastHour()};` : '';

  let queryObj = {
    metrics: 'ga:uniquePageviews',
    dimensions: ['ga:pagePath', 'ga:date'],
    startDate: startDate,
    endDate: offsetDate(),
    sort: '-ga:uniquePageviews',
    maxResults: 10000, // maximum Google's API allows is 10000,
    startIndex: startIndexOffset || 1,
    filters: `ga:pagePath=${pagePath};${hourFilter}ga:uniquePageviews>0`
  };

  new Promise((resolve, reject) => {
    queryGoogleApiData(resolve, reject, queryObj);
  })
  .then(data => {

    // // TODO: is there a way to bulkUpdate all these records? This seems very
    // // inefficient to loop over this array of promises...
    // let promises = [];
    // for (row of data.rows) {
    //   // chop up the string and extract the id
    //   let pathName = // /episodes or /clips?
    //   let pathNameId = // the id of the episode or clip
    //
    //   let params = {};
    //   params.pastHourTotalUniquePageviews = ;
    //   if (pathName === '/episodes') {
    //     EpisodeService.update(); // push into array
    //   } else if (pathName === '/clips') {
    //     ClipService.update(); // push into array
    //   }
    // }

    console.log(data);

    // Promise.all(promises)
    // .then(() => {
    //   // Requery if the maximum number of rows were returned
    //   if (data.rows && data.rows.length === 10000) {
    //     queryUniquePageviewsFromPastHour(pagePath, (parseInt(startIndexOffset) + 10000))
    //   }
    // })
    // .catch(err => {
    //   console.logs(err);
    // })

  })
  .catch(err => {
    console.log(err);
  });

}

module.exports = {
  queryUniquePageviews
};
