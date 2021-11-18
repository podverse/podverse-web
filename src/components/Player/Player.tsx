import OmniAural, { useOmniAural } from "omniaural"
import classnames from "classnames"
import { PlayerItemInfo } from "./PlayerItemInfo"
import { PlayerItemProgess } from "./PlayerItemProgress"
import { PlayerItemButtons } from "./PlayerItemOptions"

type Props = {}

export const Player = ({}: Props) => {
  const [player] = useOmniAural("player")

  const mainPlayerStyle = classnames(
    "player",
    !!player.show ? "" : "display-none"
  )

  if (!player?.nowPlayingItem) {
    return null
  }

  return (
    <div className={mainPlayerStyle}>
      <PlayerItemInfo nowPlayingItem={player.nowPlayingItem} />
      <PlayerItemProgess
        nowPlayingItem={player.nowPlayingItem}
        isPaused={false}
      />
      <PlayerItemButtons muted={player.muted} playSpeed={player.playSpeed} />
    </div>
  )
}
