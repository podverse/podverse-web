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
  }
}

module.exports = {
  isClipMediaRef: isClipMediaRef,
  isClipMediaRefWithTitle: isClipMediaRefWithTitle
}
