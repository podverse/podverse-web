import { useOmniAural } from "omniaural"
import classnames from "classnames"
import { PlayerItemInfo } from "./PlayerItemInfo"
import { PlayerItemProgress } from "./PlayerItemProgress"
import { PlayerItemButtons } from "./PlayerItemOptions"

type Props = {}

export const Player = ({}: Props) => {
  const [player] = useOmniAural("player")

  const mainPlayerStyle = classnames(
    "player",
    !!player.show ? "" : "display-none"
  )

  if (!player?.currentNowPlayingItem) {
    return null
  }

  console.log('Player render')

  return (
    <div className={mainPlayerStyle}>
      <PlayerItemInfo nowPlayingItem={player.currentNowPlayingItem} />
      <PlayerItemProgress />
      <PlayerItemButtons />
    </div>
  )
}
