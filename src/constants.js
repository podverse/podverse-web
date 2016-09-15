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

const isClipMediaRefWithDescription = {
  $not: {
    startTime: 0,
    $and: {
      $not: {
        endTime: ''
      }
    }
  },
  $not: {
    description: null
  },
  $not: {
    description: ''
  }
}

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefWithDescription: isClipMediaRefWithDescription
}
