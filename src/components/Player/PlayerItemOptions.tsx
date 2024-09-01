import classnames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import { PlayerOptionButton } from './options/PlayerOptionButton'
import { PlaySpeed } from './options/PlaySpeed'
import { Slider } from '../Slider/Slider'
import {
  playerGetPosition,
  playerMute,
  playerSetPlaybackSpeedAndCookies,
  playerSetVolume,
  playerUnmute
} from '~/services/player/player'
import { modalsAddToPlaylistShowOrAlert } from '~/state/modals/addToPlaylist/actions'
import { convertSecToHHMMSS } from '~/lib/utility/time'
import { OmniAuralState } from '~/state/omniauralState'
import { useTranslation } from 'next-i18next'
import { useCookies } from 'react-cookie'

type Props = {
  isEmbed?: boolean
  isFullScreen?: boolean
}

export const PlayerItemButtons = (props: Props) => {
  const { isEmbed, isFullScreen } = props
  const { t } = useTranslation()
  const [cookies, setCookie] = useCookies([])
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { currentNowPlayingItem, muted, playSpeed, showFullView, volume } = player
  const { liveItem } = currentNowPlayingItem
  const isLiveItem = !!liveItem
  const container = classnames('player-buttons-container')

  return (
    <div className={container}>
      <div className='player-control-button-row'>
        {!isLiveItem && (
          <>
            {!isEmbed && (
              <PlayerOptionButton
                ariaLabel={t('Add to Playlist')}
                onClick={() => modalsAddToPlaylistShowOrAlert(currentNowPlayingItem)}
                size='small'
                type='add'
              />
            )}
            <PlaySpeed
              ariaDescription={t('Playback speed')}
              onChange={(newSpeed) => playerSetPlaybackSpeedAndCookies(newSpeed, cookies, setCookie)}
              size='small'
              playSpeed={playSpeed}
            />
            {!isEmbed && (
              <PlayerOptionButton
                ariaLabel={t('Make Clip')}
                onClick={() => {
                  const currentPlaybackPosition = playerGetPosition() || 0
                  const hhmmssPlaybackPosition = convertSecToHHMMSS(currentPlaybackPosition)
                  OmniAural.makeClipSetStartTime(hhmmssPlaybackPosition)
                  const userInfo = OmniAural.state.session.userInfo.value()
                  userInfo ? OmniAural.makeClipShow() : OmniAural.modalsLoginToAlertShow('make clip')
                }}
                size='small'
                type='make-clip'
              />
            )}
          </>
        )}
      </div>
      {/* <PlayerOptionButton type="share" size="small" /> */}
      <div className='player-control-volume-wrapper'>
        <PlayerOptionButton
          ariaLabel={t('Mute')}
          ariaPressed
          onClick={() => {
            muted ? playerUnmute() : playerMute()
          }}
          size='small'
          type={muted ? 'mute' : 'unmute'}
        />
        <Slider
          ariaLabel={t('Volume')}
          className='volume'
          currentValue={muted ? 0 : volume}
          endVal={100}
          onValueChange={playerSetVolume}
          startVal={0}
        />
        <PlayerOptionButton
          ariaLabel={isFullScreen ? t('Hide full screen player') : t('Show full screen player')}
          ariaPressed
          onClick={showFullView ? OmniAural.playerFullViewHide : OmniAural.playerFullViewShow}
          size='small'
          type={showFullView ? 'fullscreen-hide' : 'fullscreen-show'}
        />
      </div>
    </div>
  )
}
