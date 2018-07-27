const _ = require('lodash');

const isClipMediaRef = (podcastFeedUrls, episodeMediaUrl, userId, includePrivate = false) => {

  let customQuery = {
    $not: {
      startTime: 0,
      endTime: null
    },
    $and: {
      $not: {
        $or: [
          {title: null},
          {title: ''}
        ]
      }
    }
  }

  if (!includePrivate) {
    customQuery.$and.$not.$or.push({isPublic: false});
  }

  if (episodeMediaUrl || (podcastFeedUrls && podcastFeedUrls.length > 0) || userId) {
    customQuery.$and.$or = [{
      $and: {
        $or: []
      }
    }]
  }

  if (episodeMediaUrl && episodeMediaUrl.length > 0) {

    episodeMediaUrl = episodeMediaUrl || '';
    episodeMediaUrl = episodeMediaUrl.replace(/(^\w+:|^)\/\//, '');
    customQuery.$and.$or[0].$and.$or.push({episodeMediaUrl: 'http://' + episodeMediaUrl});
    customQuery.$and.$or[0].$and.$or.push({episodeMediaUrl: 'https://' + episodeMediaUrl});

  } else if (podcastFeedUrls && podcastFeedUrls.length > 0) {

    podcastFeedUrls.forEach(podcastFeedUrl => {
      podcastFeedUrl = podcastFeedUrl || '';
      podcastFeedUrl = podcastFeedUrl.replace(/(^\w+:|^)\/\//, '');
      customQuery.$and.$or.push({podcastFeedUrl: 'http://' + podcastFeedUrl});
      customQuery.$and.$or.push({podcastFeedUrl: 'https://' + podcastFeedUrl});
    });

  } else if (userId) {
    customQuery.$and.$or.push({ownerId: userId});
  }

  return customQuery;
}

const allowedFilterTypes = {
  'all': {
    dropdownText: 'All Podcasts'
  },
  'subscribed': {
    dropdownText: 'Subscribed'
  },
  'myClips': {
    dropdownText: 'My Clips'
  }
};

const isFilterAllowed = (filterType) => {
  if (filterType && _.includes(Object.keys(allowedFilterTypes), filterType)) {
    return true;
  } else {
    return false;
  }
}

const allowedSortTypes = {
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

const isSortAllowed = (sortType) => {
  if (sortType && _.includes(Object.keys(allowedSortTypes), sortType)) {
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
  allowedFilterTypes: allowedFilterTypes,
  allowedSortTypes: allowedSortTypes,
  isSortAllowed: isSortAllowed,
  isValidPageViewTimeRange: isValidPageViewTimeRange
}
