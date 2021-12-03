import classnames from 'classnames'
import OmniAural, { useOmniAural } from 'omniaural'
import { PlayerOptionButton } from './options/PlayerOptionButton'
import { Slider } from '../Slider/Slider'
import { playerMute, playerNextSpeed, playerSetVolume, playerUnmute } from '~/services/player/player'
import { modalsAddToPlaylistShowOrAlert } from '~/state/modals/addToPlaylist/actions'

type Props = {}

export const PlayerItemButtons = (props: Props) => {
  const [player] = useOmniAural('player')
  const { currentNowPlayingItem, muted, playSpeed, showFullView, volume } = player
  const container = classnames('player-buttons-container')

  return (
    <div className={container}>
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
          const userInfo = OmniAural.state.session.userInfo.value()
          userInfo ? OmniAural.makeClipShow() : OmniAural.modalsLoginToAlertShow('make clip')
        }}
        size='small'
        type='make-clip'
      />
      {/* <PlayerOptionButton type="share" size="small" /> */}
      <div style={{ marginLeft: 20, display: 'flex', alignItems: 'center' }}>
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
      </div>
      <PlayerOptionButton
        onClick={showFullView ? OmniAural.playerFullViewHide : OmniAural.playerFullViewShow}
        size='small'
        type={showFullView ? 'fullscreen-hide' : 'fullscreen-show'}
      />
    </div>
  )
}
