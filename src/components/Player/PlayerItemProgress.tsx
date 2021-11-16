import classnames from "classnames"
import type {NowPlayingItem} from "podverse-shared"

type Props = {
  nowPlayingItem:NowPlayingItem
}

export const PlayerItemProgess = ({nowPlayingItem}: Props) => {
 
  const container = classnames(
    "player-progress-container"
  )
  return (
    <div className={container}>
      {"Progress"}
    </div>
  )
}
