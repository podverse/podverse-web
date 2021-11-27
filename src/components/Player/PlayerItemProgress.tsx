import classnames from "classnames"
import type { NowPlayingItem } from "podverse-shared"
import { PlayerProgressButtons } from "./controls/PlayerProgressButtons"
import { ProgressBar } from "./controls/ProgressBar"

type Props = {
  nowPlayingItem: NowPlayingItem
  isPaused?: boolean
}

export const PlayerItemProgress = ({ nowPlayingItem, isPaused }: Props) => {
  const container = classnames("player-progress-container")

  return (
    <div className={container}>
      <PlayerProgressButtons />
      <ProgressBar />
    </div>
  )
}
