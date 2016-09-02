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

module.exports = {
  isClipMediaRef: isClipMediaRef
}
