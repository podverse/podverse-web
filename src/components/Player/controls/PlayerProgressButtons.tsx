import OmniAural from 'omniaural'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { useOmniAural } from 'omniaural'
import { ButtonCircle } from '~/components'
import { PlayerItemButtons } from '~/components/Player/PlayerItemOptions'
import { PlayerControlButton } from '~/components/Player/controls/PlayerControlButton'
import {
  playerJumpBackward,
  playerJumpForward,
  playerJumpMiniBackwards,
  playerJumpMiniForwards,
  playerPause,
  playerPlay,
  playerPlayNextChapterOrQueueItem,
  playerPlayPreviousChapterOrReturnToBeginningOfTrack,
  playerResetLiveItemAndResumePlayback
} from '~/services/player/player'
import { OmniAuralState } from '~/state/omniauralState'
import { useTranslation } from 'next-i18next'

type Props = {
  hasMiniJump?: boolean
  isEmbed?: boolean
}

export const PlayerProgressButtons = ({ hasMiniJump, isEmbed }: Props) => {
  const { t } = useTranslation()
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { currentNowPlayingItem, paused } = player
  const { liveItem } = currentNowPlayingItem
  const isLiveItem = !!liveItem
  const container = classnames('progress-button-container')
  const playpause = classnames(paused ? 'play' : 'pause')

  const chapters = OmniAural.state.player.chapters.value()
  const hasChapters = chapters && chapters.length > 1

  const _handleTrackPrevious = () => {
    playerPlayPreviousChapterOrReturnToBeginningOfTrack()
  }

  const _handleTimeJumpBackwards = () => {
    playerJumpBackward()
  }

  const _handleTimeJumpMiniBackwards = () => {
    playerJumpMiniBackwards()
  }

  const _handleTogglePlay = () => {
    paused ? playerPlay() : playerPause()
  }

  const _handleTimeJumpMiniForwards = () => {
    playerJumpMiniForwards()
  }

  const _handleTimeJumpForwards = () => {
    playerJumpForward()
  }

  const _handleTrackNext = () => {
    if (isLiveItem) {
      playerResetLiveItemAndResumePlayback()
    } else {
      playerPlayNextChapterOrQueueItem()
    }
  }

  return (
    <div className={container}>
      <div className='top-row'>
        {((!isEmbed && !hasMiniJump) || (isEmbed && hasChapters)) && (
          <PlayerControlButton
            ariaLabel={hasChapters ? t('Previous chapter') : t('Previous track')}
            direction='backwards'
            onClick={_handleTrackPrevious}
            size='medium'
            type='skip'
          />
        )}
        <PlayerControlButton
          ariaLabel={t('Jump back 10 seconds')}
          direction='backwards'
          onClick={_handleTimeJumpBackwards}
          size='medium'
          type='jump'
        />
        {hasMiniJump && (
          <PlayerControlButton
            ariaLabel={t('Jump back 1 second')}
            direction='backwards'
            onClick={_handleTimeJumpMiniBackwards}
            size='medium'
            type='mini-jump'
          />
        )}
        <ButtonCircle
          ariaLabel={paused ? t('Play') : t('Pause')}
          ariaPressed
          className={playpause}
          faIcon={paused ? faPlay : faPause}
          onClick={_handleTogglePlay}
          size={'medium'}
        />
        {hasMiniJump && (
          <PlayerControlButton
            ariaLabel={t('Jump forward 1 second')}
            direction='forwards'
            onClick={_handleTimeJumpMiniForwards}
            size='medium'
            type='mini-jump'
          />
        )}
        <PlayerControlButton
          ariaLabel={t('Jump forward 30 seconds')}
          direction='forwards'
          onClick={_handleTimeJumpForwards}
          size='medium'
          type='jump'
        />
        {((!isEmbed && !hasMiniJump) || (isEmbed && hasChapters)) && (
          <PlayerControlButton
            ariaLabel={hasChapters ? t('Next chapter') : t('Next track')}
            direction='forwards'
            onClick={_handleTrackNext}
            size='medium'
            type='skip'
          />
        )}
      </div>
      <div className='bottom-row'>
        {
          !isEmbed && (
            <PlayerItemButtons />
          )
        }
      </div>
    </div>
  )
}
