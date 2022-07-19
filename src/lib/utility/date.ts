import moment from 'moment'
import 'moment/locale/de'
import 'moment/locale/el'
import 'moment/locale/es'
import 'moment/locale/fr'
import 'moment/locale/lt'
import 'moment/locale/nb'
import 'moment/locale/pt'
import 'moment/locale/ru'
import 'moment/locale/sv'
import 'moment/locale/tr'
import OmniAural from 'omniaural'
import { Episode, MediaRef } from 'podverse-shared'
import { getLang } from './locales'
import { convertSecToHhoursMMinutes, getTimeLabelText, readableClipTime } from './time'

export const readableDate = (date: Date, withTime?: boolean) => {
  moment.locale(getLang())
  const format = withTime ? 'MMMM Do YYYY, h:mm:ss a' : 'MMM Do YYYY'
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

export const generateItemTimeInfo = (t: any, episode?: Episode, clip?: MediaRef, isChapter?: boolean) => {
  let endDate = null
  let pubDate = null
  let timeInfo = null
  // TODO: add timeRemaining support
  const timeRemaining = null
  let completed = false
  const liveItem = episode?.liveItem

  /* historyItemsIndex is way too big with useOmniAural */
  // const [historyItemsIndex] = useOmniAural('historyItemsIndex')
  const historyItemsIndex = OmniAural.state.historyItemsIndex.value()

  if (liveItem) {
    const withTime = true
    pubDate = readableDate(liveItem.start, withTime)
    endDate = readableDate(liveItem.end, withTime)
  } else if (clip) {
    pubDate = readableDate(clip.episode.pubDate)
    timeInfo = readableClipTime(clip.startTime, clip.endTime, isChapter)
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
