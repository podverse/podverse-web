import classnames from "classnames"
import { useState } from "react"
import { ButtonCircle } from "../.."
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons"
import { PlayerControlButton } from "./PlayerControlButton"

type Props = {
  isPaused?: boolean
}

export const PlayerProgressButtons = ({ isPaused }: Props) => {
  const container = classnames("progress-button-container")

  const playpause = classnames(isPaused ? "pause" : "play")

  return (
    <div className={container}>
      <PlayerControlButton type="skip" direction="backwards" size="medium" />
      <PlayerControlButton type="jump" direction="backwards" size="medium" />
      <ButtonCircle
        className={playpause}
        faIcon={isPaused ? faPause : faPlay}
        onClick={() => console.log("Play Button Pressed")}
        size={"medium"}
      />
      <PlayerControlButton type="jump" direction="forwards" size="medium" />
      <PlayerControlButton type="skip" direction="forwards" size="medium" />
    </div>
  )
}
