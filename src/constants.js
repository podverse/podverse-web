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

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle
}
