import { Episode, MediaRef } from 'podverse-shared'
import { generateItemTimeInfo } from './date'

export const generateAriaItemTimeInfo = (t: any, episode: Episode, clip?: MediaRef) => {
  const { completed, pubDate, timeInfo /*, timeRemaining */ } = generateItemTimeInfo(t, episode, clip)
  /* TODO: add time remaining info */
  const ariaLabel = `${pubDate} ${completed ? `, ${t('Finished episode')}` : ''} ${timeInfo ? `, ${timeInfo}` : ''}`

  return ariaLabel
}
