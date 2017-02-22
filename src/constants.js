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
  }
}

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle
}
