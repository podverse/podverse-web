const _ = require('lodash');

const isClipMediaRef = {
  $not: {
    startTime: 0,
    endTime: null
  }
}

const isClipMediaRefWithTitle = {
  $not: {
    startTime: 0,
    endTime: null,
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

const isClipMediaRefForPodcast = (params = {}) => {
  let podcastFeedUrl = params.podcastFeedURL || '';
  podcastFeedUrl = podcastFeedUrl.replace(/(^\w+:|^)\/\//, '');
  let episodeMediaUrl = params.episodeMediaURL || '';
  episodeMediaUrl = episodeMediaUrl.replace(/(^\w+:|^)\/\//, '');

  let customQuery = {
    $not: {
      startTime: 0,
      endTime: null
    },
    $and: {
      $or: [
        {$and: {
          $or: []
        }}
      ],
      $not: {
        $or: [
          {title: null},
          {title: ''},
          {isPublic: false}
        ]
      }
    }
  }

  if (podcastFeedUrl.length > 0) {
    customQuery.$and.$or.push({podcastFeedURL: 'http://' + podcastFeedUrl});
    customQuery.$and.$or.push({podcastFeedURL: 'https://' + podcastFeedUrl});
  }

  if (episodeMediaUrl.length > 0) {
    customQuery.$and.$or[0].$and.$or.push({episodeMediaURL: 'http://' + episodeMediaUrl});
    customQuery.$and.$or[0].$and.$or.push({episodeMediaURL: 'https://' + episodeMediaUrl});
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

const checkIfFilterIsAllowed = (filterType) => {
  if (filterType && _.includes(Object.keys(allowedFilters), filterType)) {
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
  isClipMediaRefForPodcast: isClipMediaRefForPodcast,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle,
  allowedFilters: allowedFilters,
  checkIfFilterIsAllowed: checkIfFilterIsAllowed,
  isValidPageViewTimeRange: isValidPageViewTimeRange
}
