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

// NOTE: I am manually offsetting by 5 hours since the server is in UTC but the
// Google Analytics data is in CST.
// This WILL cause a problem when DST happens. I don't know how to automatically
// handle this.
function lastHour () {
  let todayDate = new Date();
  todayDate.setMinutes((todayDate.getMinutes() - todayDate.getTimezoneOffset()) - 300 - 60);
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

function readableDate (date) {
  if (typeof date === 'string' || typeof date === 'object') {
    // Thanks:) http://stackoverflow.com/questions/19485353/function-to-convert-timestamp-to-human-date-in-javascript
    var dateObj = new Date(date),
        year = dateObj.getFullYear(),
        month = dateObj.getMonth() + 1,
        day = dateObj.getDate();


    // If date is within the past 6 days, then display name of day instead of date
    var date6DaysAgo = new Date().getTime() - (6 * 24 * 60 * 60 * 1000);
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() -1);

    if (dateObj > date6DaysAgo) {
      if (dateObj.getDay() === today.getDay()) {
        return 'Today';
      } else if (dateObj.getDay() === yesterday.getDay()) {
        return 'Yesterday';
      } else {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var dayName = days[dateObj.getDay()];
        return dayName
      }
    } else {
      // Else return the date in mm/dd/yyyy format
      return month+'/'+day+'/'+year;
    }
  }
}

function removeArticles(str) {
  let words = str.split(" ");
  if(words.length <= 1) return str;
  if( words[0] == 'a' || words[0] == 'the' || words[0] == 'an' )
    return words.splice(1).join(" ");
  return str;
}

function shouldShowNextButton (pageIndex, total) {
  let offset = (pageIndex * 10) - 10;
  let showNextButton = offset + 10 < total ? true : false;
  return showNextButton;
}

module.exports = {
  isNonAnonUser,
  offsetDate,
  lastHour,
  convertSecToHHMMSS,
  readableDate,
  removeArticles,
  shouldShowNextButton
}
