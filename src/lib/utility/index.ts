export { validatePassword } from './validatePassword'

export const convertToYYYYMMDDHHMMSS = () => {
  const now = new Date()
  let year = '' + now.getFullYear()
  let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month }
  let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day }
  let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour }
  let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute }
  let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

// @ts-ignore
Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

export const isBeforeDate = (expirationDate, dayOffset = 0) => {
  const currentDate = new Date()
  // @ts-ignore
  const offsetDate = currentDate.addDays(dayOffset)
  return new Date(expirationDate) > offsetDate
}

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const readableDate = (date) => {
  const dateObj = new Date(date),
    year = dateObj.getFullYear(),
    month = dateObj.getMonth() + 1,
    day = dateObj.getDate();

  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return month + '/' + day + '/' + year;
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
  if ((startTime || startTime === 0) && endTime) {
    let e = convertSecToHHMMSS(endTime)
    return `${s} to ${e}`
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

export const getCookie = name => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) {
    return match[2]
  }

  return
}

export const deleteCookie = name => {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=localhost;'
}

export const clone = obj => {
  if (null == obj || "object" != typeof obj) return obj
  var copy = obj.constructor()
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

export const getUrlFromRequestOrWindow = req =>
  req && req.headers ? 
    req.headers.referer
    : `${location.protocol}//${location.hostname}${location.pathname}`

export const alertPremiumRequired = () => {
  alert('This feature is only available for premium members. Please visit the Settings page to sign up.')
}

export const alertSomethingWentWrong = () => {
  alert('Something went wrong. Please check your internet connection.')
}

export const copyToClipboard = (text) => {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

// Remove double quotes from text so it does not cut off in SEO descriptions
export const removeDoubleQuotes = str => str ? str.replace(/["]+/g, '') : ''

export const alertRateLimitError = err => {
  alert(err.response.data.message)
}

export const getPlaybackPositionFromHistory = (historyItems: any[], nowPlayingItem: any) => {
  if (historyItems && historyItems.length > 0) {
    const oldItem = historyItems.find((x) => x.episodeId && nowPlayingItem.episodeId)
    if (oldItem && oldItem.userPlaybackPosition) {
      return oldItem.userPlaybackPosition
    }
  }

  return nowPlayingItem.userPlaybackPosition || 0
}
