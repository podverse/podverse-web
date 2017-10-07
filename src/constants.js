const _ = require('lodash');

const isClipMediaRef = (podcastFeedUrls, episodeMediaUrl) => {

  let customQuery = {
    $not: {
      startTime: 0,
      endTime: null
    },
    $and: {
      $not: {
        $or: [
          {title: null},
          {title: ''},
          {isPublic: false}
        ]
      }
    }
  }

  if (episodeMediaUrl || (podcastFeedUrls && podcastFeedUrls.length > 0)) {
    customQuery.$and.$or = [{
      $and: {
        $or: []
      }
    }]
  }

  if (episodeMediaUrl && episodeMediaUrl.length > 0) {

    episodeMediaUrl = episodeMediaUrl || '';
    episodeMediaUrl = episodeMediaUrl.replace(/(^\w+:|^)\/\//, '');
    customQuery.$and.$or[0].$and.$or.push({episodeMediaURL: 'http://' + episodeMediaUrl});
    customQuery.$and.$or[0].$and.$or.push({episodeMediaURL: 'https://' + episodeMediaUrl});

  } else if (podcastFeedUrls && podcastFeedUrls.length > 0) {

    podcastFeedUrls.forEach(podcastFeedUrl => {
      podcastFeedUrl = podcastFeedUrl || '';
      podcastFeedUrl = podcastFeedUrl.replace(/(^\w+:|^)\/\//, '');
      customQuery.$and.$or.push({podcastFeedURL: 'http://' + podcastFeedUrl});
      customQuery.$and.$or.push({podcastFeedURL: 'https://' + podcastFeedUrl});
    });

  }

  return customQuery;
}

const allowedFilters = {
  'pastHour': {
    query: 'pastHourTotalUniquePageviews',
    dropdownText: 'top - past hour'
  },
  'pastDay': {
    query: 'pastDayTotalUniquePageviews',
    dropdownText: 'top - past day'
  },
  'pastWeek': {
    query: 'pastWeekTotalUniquePageviews',
    dropdownText: 'top - past week'
  },
  'pastMonth': {
    query: 'pastMonthTotalUniquePageviews',
    dropdownText: 'top - past month'
  },
  'pastYear': {
    query: 'pastYearTotalUniquePageviews',
    dropdownText: 'top - past year'
  },
  'allTime': {
    query: 'allTimeTotalUniquePageviews',
    dropdownText: 'top - all time'
  },
  'recent': {
    query: 'dateCreated',
    dropdownText: 'most recent'
  }
};

const isFilterAllowed = (sortingType) => {
  if (sortingType && _.includes(Object.keys(allowedFilters), sortingType)) {
    return true;
  } else {
    return false;
  }
}

const isValidPageViewTimeRange = (str) => {
  const validValues = [
    'pastHourTotalUniquePageviews',
    'pastDayTotalUniquePageviews',
    'pastWeekTotalUniquePageviews',
    'pastMonthTotalUniquePageviews',
    'pastYearTotalUniquePageviews',
    'allTimeTotalUniquePageviews'
  ];

  return (validValues.indexOf(str) > -1);

}

module.exports = {
  isClipMediaRef: isClipMediaRef,
  allowedFilters: allowedFilters,
  isFilterAllowed: isFilterAllowed,
  isValidPageViewTimeRange: isValidPageViewTimeRange
}
