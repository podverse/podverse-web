import { Episode, MediaRef } from 'podverse-shared'
import { ariaLiveItemStatusLabel } from '~/services/liveItem'
import { generateItemTimeInfo } from './date'

export const generateAriaItemTimeInfo = (t: any, episode: Episode, clip?: MediaRef) => {
  const { completed, pubDate, timeInfo /*, timeRemaining */ } = generateItemTimeInfo(t, episode, clip)
  const { liveItem } = episode
  /* TODO: add time remaining info */
  const ariaLabel = `${liveItem?.status ? `${ariaLiveItemStatusLabel(liveItem?.status, t)},` : ''} ${pubDate} ${
    !liveItem && completed ? `, ${t('Finished episode')}` : ''
  } ${timeInfo ? `, ${timeInfo}` : ''}`

  return ariaLabel
}
