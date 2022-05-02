import moment from 'moment'
import OmniAural from 'omniaural'
import { Episode, MediaRef } from 'podverse-shared'
import { convertSecToHhoursMMinutes, getTimeLabelText, readableClipTime } from './time'

export const readableDate = (date: Date, withTime?: boolean) => {
  const format = withTime ? 'MMM Do YYYY, h:mm:ss a' : 'MMM Do YYYY'
  return moment(date).format(format)
}

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

export const isBeforeDate = (expirationDate, dayOffset = 0) => {
  const currentDate = new Date() as any
  const offsetDate = currentDate.addDays(dayOffset)
  return new Date(expirationDate) > offsetDate
}

export const generateItemTimeInfo = (t: any, episode: Episode, clip?: MediaRef) => {
  let endDate = null
  let pubDate = null
  let timeInfo = null
  // TODO: add timeRemaining support
  const timeRemaining = null
  let completed = false
  const { liveItem } = episode

  /* historyItemsIndex is way too big with useOmniAural */
  // const [historyItemsIndex] = useOmniAural('historyItemsIndex')
  const historyItemsIndex = OmniAural.state.historyItemsIndex.value()

  if (liveItem) {
    const withTime = true
    pubDate = readableDate(liveItem.start, withTime)
    endDate = readableDate(liveItem.end, withTime)
  } else if (clip) {
    pubDate = readableDate(clip.episode.pubDate)
    timeInfo = readableClipTime(clip.startTime, clip.endTime)
  } else if (episode) {
    pubDate = readableDate(episode.pubDate)
    const historyItem = historyItemsIndex.episodes[episode.id]
    if (historyItem) {
      timeInfo = getTimeLabelText(t, historyItem.d, episode.duration, historyItem.p)
      completed = historyItem.c
    } else if (episode.duration > 0) {
      timeInfo = convertSecToHhoursMMinutes(episode.duration)
    }
  }

  return {
    completed,
    endDate,
    pubDate,
    timeInfo,
    timeRemaining
  }
}
