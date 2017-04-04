// TODO: This code is often duplicated in nunjucks.js. I tried loading this
// in the src/nunjucks.js file, but it says "unexpected token export". I'm doing
// something wrong with the babel es2015 or something...

export function calcDuration (startTime, endTime) {
  if (endTime > startTime) {
    return endTime - startTime;
  } else {
    return;
  }
}

export function convertSecToHHMMSS (sec) {
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

export function readableDate (date) {
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

export function convertHHMMSSToSeconds (hhmmssString) {

  var hhmmssArray = hhmmssString.split(':') || 0,
    hours = 0,
    minutes = 0,
    seconds = 0;

  if (hhmmssArray.length === 3) {
    hours = parseInt(hhmmssArray[0]);
    minutes = parseInt(hhmmssArray[1]);
    seconds = parseInt(hhmmssArray[2]);


    if (hours < 0 || minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
      console.log('Invalid time provided.');
      return -1;
    }

    hours = hours * 3600;
    minutes = minutes * 60;

  } else if (hhmmssArray.length === 2) {
    minutes = parseInt(hhmmssArray[0]);
    seconds = parseInt(hhmmssArray[1]);

    if (minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
      console.log('Invalid time provided.');
      return -1;
    }

    minutes = minutes * 60;

  } else if (hhmmssArray.length === 1) {
    seconds = parseInt(hhmmssArray[0]) || 0;

    if (seconds > 59 || seconds < 0) {
      console.log('Invalid time provided.');
      return -1;
    }

  } else {
    console.log('Invalid time provided.');
    return -1;
  }

  return hours + minutes + seconds;

}

export function secondsToReadableDuration (sec) {
  sec = Number(sec);
  var h = Math.floor(sec / 3600);
  var m = Math.floor(sec % 3600 / 60);
  var s = Math.floor(sec % 3600 % 60);

  var hDisplay = h > 0 ? h + "h " : "";
  var mDisplay = m > 0 ? m + "m " : "";
  var sDisplay = s > 0 ? s + "s" : "";

  var fullDisplay = hDisplay + mDisplay + sDisplay;

  // Thanks Jon http://stackoverflow.com/a/6253616/2608858
  if (fullDisplay.substr(fullDisplay.length-1) === ' ') {
    fullDisplay = fullDisplay.substr(0, fullDisplay.length-1);
  }

  return fullDisplay;
}

export function isHHMMSS (val) {
  var pattern = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  return pattern.test(val);
}

export function isInt (val) {
  return !isNaN(val) &&
          parseInt(Number(val)) == val &&
          !isNaN(parseInt(val, 10));
}

export function isUUID (val) {
  var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return pattern.test(val);
}

// Used to enable/disable auth protected features in the frontend
export function isNonAnonLoggedInUser () {
  return window.isLoggedIn;
}

// Thanks:D David Walsh https://davidwalsh.name/javascript-debounce-function
export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
