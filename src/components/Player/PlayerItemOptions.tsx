import classnames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import { PlayerOptionButton } from './options/PlayerOptionButton'
import { Slider } from '../Slider/Slider'
import { playerGetPosition, playerMute, playerNextSpeed, playerSetVolume, playerUnmute } from '~/services/player/player'
import { modalsAddToPlaylistShowOrAlert } from '~/state/modals/addToPlaylist/actions'
import { convertSecToHHMMSS } from '~/lib/utility/time'
import { OmniAuralState } from '~/state/omniauralState'

type Props = unknown

export const PlayerItemButtons = (props: Props) => {
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { currentNowPlayingItem, muted, playSpeed, showFullView, volume } = player
  const container = classnames('player-buttons-container')

  return (
    <div className={container}>
      <div className='player-control-button-row'>
        <PlayerOptionButton onClick={playerNextSpeed} size='small' type='speed'>
          {playSpeed}x
        </PlayerOptionButton>
        <PlayerOptionButton
          onClick={() => modalsAddToPlaylistShowOrAlert(currentNowPlayingItem)}
          size='small'
          type='add'
        />
        <PlayerOptionButton
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
      </div>
      {/* <PlayerOptionButton type="share" size="small" /> */}
      <div className='player-control-volume-wrapper'>
        <PlayerOptionButton
          onClick={() => {
            muted ? playerUnmute() : playerMute()
          }}
          size='small'
          type={muted ? 'mute' : 'unmute'}
        />
        <Slider
          className='volume'
          currentValue={muted ? 0 : volume}
          endVal={100}
          onValueChange={playerSetVolume}
          startVal={0}
        />
        <PlayerOptionButton
          onClick={showFullView ? OmniAural.playerFullViewHide : OmniAural.playerFullViewShow}
          size='small'
          type={showFullView ? 'fullscreen-hide' : 'fullscreen-show'}
        />
      </div>
    </div>
  )
}
