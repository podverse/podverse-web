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
