'use strict';

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
        {pastMonthTotalUniquePageviews: null}
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

  if (params.timeRange) {
    customQuery.$and.$not.$or[params.timeRange] = null;
  }

  return customQuery;
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
  isValidPageViewTimeRange: isValidPageViewTimeRange
}
