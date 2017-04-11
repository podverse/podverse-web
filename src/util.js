'use strict';

// Used by the backend in middleware in routes.js
function isNonAnonUser (userId='') {
  return (userId.indexOf('auth0') === 0);
}

// Thanks Fernando Aguilar http://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd#comment66229498_38148759
function offsetDate (minutesOffset=0) {
  let todayDate = new Date();
  todayDate.setMinutes((todayDate.getMinutes() - todayDate.getTimezoneOffset()) + minutesOffset);
  todayDate = todayDate.toISOString().slice(0,10);
  return todayDate;
}

function lastHour () {
  let todayDate = new Date();
  todayDate.setMinutes((todayDate.getMinutes() - todayDate.getTimezoneOffset()) - 60);
  let lastHour = todayDate.toISOString().slice(11,13);
  lastHour = parseInt(lastHour);
  return lastHour;
}

function convertSecToHHMMSS (sec) {
  // thanks to dkreuter http://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
  var totalSec = sec;

  var hours = parseInt(totalSec / 3600) % 24;
  var minutes = parseInt(totalSec / 60) % 60;
  var seconds = totalSec % 60;
  var result = '';

  if (hours > 0) {
    result += hours + ':';
  }

  if (minutes > 9) {
    result += minutes + ':';
  } else if (minutes > 0 && hours > 0) {
    result += '0' + minutes + ':';
  } else if (minutes > 0){
    result += minutes + ':';
  } else if (minutes === 0 && hours > 0) {
    result +=  '00:';
  }

  if (seconds > 9) {
    result += seconds;
  } else if (seconds > 0 && minutes > 0) {
    result += '0' + seconds;
  } else if (seconds > 0) {
    result += seconds;
  } else {
    result += '00';
  }

  if (result.length == 2) {
    result = '0:' + result;
  }

  if (result.length == 1) {
    result = '0:0' + result;
  }

  return result
}

module.exports = {
  isNonAnonUser,
  offsetDate,
  lastHour,
  convertSecToHHMMSS
}
