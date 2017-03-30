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
    endTime: null
  },
  $and: {
    $not: {
      title: null
    }
  },
  $and: {
    $not: {
      title: ''
    }
  },
  $and: {
    $not: {
      pastMonthTotalUniquePageviews: null
    }
  }
}

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle
}
