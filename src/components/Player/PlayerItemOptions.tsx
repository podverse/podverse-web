import classnames from "classnames"
import { PlayerOptionButton } from "./options/PlayerOptionButton"
import OmniAural from "omniaural"
import { Slider } from "../Slider/Slider"

type Props = {
  muted: boolean
  playSpeed: string
}

export const PlayerItemButtons = ({ muted, playSpeed }: Props) => {
  const container = classnames("player-buttons-container")

  return (
    <div className={container}>
      <PlayerOptionButton type="speed" size="small">
        {playSpeed}x
      </PlayerOptionButton>
      <PlayerOptionButton type="add" size="small" />
      <PlayerOptionButton type="clip" size="small" />
      <PlayerOptionButton type="share" size="small" />
      <div style={{ marginLeft: 15, display: "flex", alignItems: "center" }}>
        <PlayerOptionButton
          type={muted ? "mute" : "unmute"}
          size="small"
          onClick={() => {
            console.log("Attempting mute: ", muted)
            muted ? OmniAural.unmutePlayer() : OmniAural.mutePlayer()
          }}
        />
        <Slider currentVal={20} startVal={0} endVal={100} />
      </div>
      <PlayerOptionButton type="fullscreen" size="small" />
    </div>
  )
}
