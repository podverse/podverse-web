export const readableDate = (date) => {
  const dateObj = new Date(date),
    year = dateObj.getFullYear(),
    month = dateObj.getMonth() + 1,
    day = dateObj.getDate();


  // If date is within the past 6 days, then display name of day instead of date
  var date6DaysAgo = new Date().getTime() - (6 * 24 * 60 * 60 * 1000);
  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (dateObj.getTime() > date6DaysAgo) {
    if (dateObj.getDay() === today.getDay()) {
      return 'Today';
    } else if (dateObj.getDay() === yesterday.getDay()) {
      return 'Yesterday';
    } else {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var dayName = days[dateObj.getDay()];
      return dayName
    }
  } else {
    // Else return the date in mm/dd/yyyy format
    return month + '/' + day + '/' + year;
  }
}

export const convertSecToHHMMSS = (sec: number) => {
  let totalSec = Math.floor(sec)
  const hours = Math.floor(totalSec / 3600)
  totalSec %= 3600
  const minutes = Math.floor(totalSec / 60)
  const seconds = Math.floor(totalSec % 60)
  let result = ''

  if (hours >= 1) {
    result += hours + ':'
  }

  if (minutes >= 10) {
    result += minutes + ':'
  } else if (minutes >= 1 && hours >= 1) {
    result += '0' + minutes + ':'
  } else if (minutes >= 1) {
    result += minutes + ':'
  } else if (minutes === 0 && hours >= 1) {
    result += '00:'
  }

  if (seconds >= 10) {
    result += seconds
  } else if (seconds >= 1 && minutes >= 1) {
    result += '0' + seconds
  } else if (seconds >= 1) {
    result += seconds
  } else {
    result += '00'
  }

  if (result.length === 2) {
    result = '0:' + result
  }

  if (result.length === 1) {
    result = '0:0' + result
  }

  return result
}

export const readableClipTime = (startTime, endTime) => {
  let s = convertSecToHHMMSS(startTime)
  if (startTime && endTime) {
    let e = convertSecToHHMMSS(endTime)
    return `${s} - ${e}`
  } else {
    return `Start: ${s}`
  }
}

export const convertObjectToQueryString = (obj) => {
  if (!obj) {
    return ''
  } else {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&')
  }
}
