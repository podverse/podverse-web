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
        {title: ''}
      ]
    }
  }
}

const isClipMediaRefForPodcast = (params = {}) => {

  let customQuery = {
    $not: {
      startTime: 0,
      endTime: null
    },
    $and: {
      podcastFeedURL: params.podcastFeedURL,
      $not: {
        $or: [
          {title: null},
          {title: ''}
        ]
      }
    }
  }

  if (params.episodeMediaURL) {
    customQuery.$and.episodeMediaURL = params.episodeMediaURL;
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
    query: 'episodePubDate',
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

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefForPodcast: isClipMediaRefForPodcast,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle,
  allowedFilters: allowedFilters,
  checkIfFilterIsAllowed: checkIfFilterIsAllowed
}
