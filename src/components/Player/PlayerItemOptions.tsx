import classnames from "classnames"
import OmniAural, { useOmniAural } from 'omniaural'
import { PlayerOptionButton } from "./options/PlayerOptionButton"
import { Slider } from "../Slider/Slider"
import { playerNextSpeed } from "~/services/player/player"

type Props = {}

export const PlayerItemButtons = (props: Props) => {
  const [player] = useOmniAural('player')
  const { muted, playSpeed } = player
  const container = classnames("player-buttons-container")

  return (
    <div className={container}>
      <PlayerOptionButton
        onClick={playerNextSpeed}
        size="small"
        type="speed">
        {playSpeed}x
      </PlayerOptionButton>
      <PlayerOptionButton type="add" size="small" />
      <PlayerOptionButton type="clip" size="small" />
      {/* <PlayerOptionButton type="share" size="small" /> */}
      <div style={{ marginLeft: 20, display: "flex", alignItems: "center" }}>
        <PlayerOptionButton
          onClick={() => {
            muted ? OmniAural.unmutePlayer() : OmniAural.mutePlayer()
          }}
          size="small"
          type={muted ? "mute" : "unmute"}
        />
        <Slider currentValue={20} startVal={0} endVal={100} />
      </div>
      <PlayerOptionButton type="fullscreen" size="small" />
    </div>
  )
}
