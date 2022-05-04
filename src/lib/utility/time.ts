export function validateHHMMSSString(hhmmss: string) {
  const regex = new RegExp(
    // eslint-disable-next-line max-len
    '^(([0-9][0-9]):([0-5][0-9]):([0-5][0-9]))$|(([0-9]):([0-5][0-9]):([0-5][0-9]))$|^(([0-5][0-9]):([0-5][0-9]))$|^(([0-9]):([0-5][0-9]))$|^([0-5][0-9])$|^([0-9])'
  )
  return regex.test(hhmmss)
}

export function convertHHMMSSToSeconds(hhmmssString: string | number) {
  if (typeof hhmmssString === 'string' && hhmmssString) {
    if (!validateHHMMSSString(hhmmssString)) {
      return -1
    }

    const hhmmssArray = hhmmssString.split(':')
    let hours = 0
    let minutes = 0
    let seconds = 0

    if (hhmmssArray.length === 3) {
      hours = parseInt(hhmmssArray[0], 10)
      minutes = parseInt(hhmmssArray[1], 10)
      seconds = parseInt(hhmmssArray[2], 10)

      if (hours < 0 || minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
        console.log('Invalid time provided.')
        return -1
      }

      hours = hours * 3600
      minutes = minutes ? minutes * 60 : 0
    } else if (hhmmssArray.length === 2) {
      minutes = parseInt(hhmmssArray[0], 10)
      seconds = parseInt(hhmmssArray[1], 10)

      if (minutes > 59 || minutes < 0 || seconds > 59 || seconds < 0) {
        console.log('Invalid time provided.')
        return -1
      }

      minutes = minutes * 60
    } else if (hhmmssArray.length === 1) {
      seconds = parseInt(hhmmssArray[0], 10) || 0

      if (seconds > 59 || seconds < 0) {
        console.log('Invalid time provided.')
        return -1
      }
    } else {
      console.log('Invalid time provided.')
      return -1
    }

    return hours + minutes + seconds
  } else {
    return null
  }
}

export const convertSecToHHMMSS = (sec: number, isLiveItem?: boolean, t?: any) => {
  const placeholder = '--:--'
  if (isLiveItem) {
    return t('Live').toUpperCase()
  } else if (sec === Infinity) {
    return placeholder
  } else {
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
}

export const readableClipTime = (startTime: number, endTime?: number, isChapter?: boolean) => {
  const s = convertSecToHHMMSS(startTime)
  if ((startTime || startTime === 0) && endTime) {
    const e = convertSecToHHMMSS(endTime)
    return `${s} to ${e}`
  } else {
    return `${!isChapter ? 'Start: ' :  ''}${s}`
  }
}

export const convertSecToHhoursMMinutes = (sec: number) => {
  let totalSec = Math.floor(sec)

  const hours = Math.floor(totalSec / 3600)
  totalSec %= 3600

  const minutes = Math.floor(totalSec / 60)
  let result = `${minutes} min`

  if (hours >= 1) {
    result = `${hours} hr ` + result
  }

  return result
}

export const getTimeLabelText = (
  t: any,
  mediaFileDuration?: number,
  episodeDuration?: number,
  userPlaybackPosition?: number,
  completed?: boolean,
  clipTime?: string
) => {
  const hasStartedItem = !!mediaFileDuration
  const totalTime = mediaFileDuration || episodeDuration || 0
  const playedTime = userPlaybackPosition || 0

  let timeLabel = ''
  const remainingText = t('left')
  if (totalTime) {
    timeLabel = convertSecToHhoursMMinutes(totalTime)
    if (hasStartedItem && playedTime > 0) {
      timeLabel = `${convertSecToHhoursMMinutes(totalTime - playedTime)} ${remainingText}`
    }
  }

  if (clipTime) {
    timeLabel = clipTime
  }

  return timeLabel
}
