import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { useOmniAural } from 'omniaural'
import { PV } from '~/resources'
import { playerPause } from '~/services/player/player'
import { audioCheckIfCurrentlyPlaying, audioIsLoaded, audioPause, audioPlay } from '~/services/player/playerAudio'
import { OmniAuralState } from '~/state/omniauralState'
import { ButtonCircle } from '..'
import { ProgressBar } from '../Player/controls/ProgressBar'

type Props = {
  isClip: boolean
}

export const TwitterCardPlayer = ({ isClip }: Props) => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { t } = useTranslation()
  const { clipFlagPositions, currentNowPlayingItem, highlightedPositions, paused } = player
  const playpause = classNames(paused ? 'play' : 'pause')
  const episodePageUrl = `${PV.RoutePaths.web.episode}/${currentNowPlayingItem?.episodeId}`
  const clipPageUrl = `${PV.RoutePaths.web.clip}/${currentNowPlayingItem?.clipId}`
  const pageUrl = isClip ? clipPageUrl : episodePageUrl

  const _handleTogglePlay = () => {
    if (audioIsLoaded()) {
      audioCheckIfCurrentlyPlaying() ? audioPause() : audioPlay()
    }
  }

  return (
    <div className='embed-player no-border'>
      <div className='embed-progress-bar-wrapper'>
        <ButtonCircle
          className={playpause}
          faIcon={paused ? faPlay : faPause}
          onClick={_handleTogglePlay}
          size={'medium'}
        />
        <ProgressBar
          chapterFlagPositions={[]}
          clipFlagPositions={clipFlagPositions}
          highlightedPositions={highlightedPositions}
        />
      </div>
      <div className='open-in-app'>
        <a href={pageUrl} onClick={playerPause} target='_blank' rel='noreferrer'>
          {t('Open in Podverse')}
        </a>
      </div>
    </div>
  )
}
