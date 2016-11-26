'use strict';

const isClipMediaRef = {
  $not: {
    startTime: 0,
    $and: {
      $not: {
        endTime: ''
      }
    }
  }
}

const isClipMediaRefWithTitle = {
  $not: {
    startTime: 0,
    $and: {
      $not: {
        endTime: ''
      }
    }
  },
  $not: {
    title: null
  },
  $not: {
    title: ''
  }
}

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle
}
