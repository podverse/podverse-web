import classnames from "classnames"
import { PlayerProgressButtons } from "./controls/PlayerProgressButtons"
import { ProgressBar } from "./controls/ProgressBar"

type Props = {}

export const PlayerItemProgress = (props: Props) => {
  const container = classnames("player-progress-container")

  return (
    <div className={container}>
      <PlayerProgressButtons />
      <ProgressBar />
    </div>
  )
}
