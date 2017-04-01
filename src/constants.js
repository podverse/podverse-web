'use strict';

const isClipMediaRef = {
  $not: {
    startTime: 0,
    endTime: null
  }
}

const isClipMediaRefForPodcast = (feedURL) => {
  return {
    $not: {
      startTime: 0,
      endTime: null
    },
    $and: {
      podcastFeedURL: feedURL
    }
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

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefForPodcast: isClipMediaRefForPodcast,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle
}
