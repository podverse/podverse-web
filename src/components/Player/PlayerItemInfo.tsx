import classnames from "classnames"
import OmniAural, {useOmniAural, useOmniAuralEffect} from "omniaural"
import type {NowPlayingItem} from "podverse-shared"
type Props = {}

export const PlayerItemInfo = ({}: Props) => {

  const [nowPlayingItem] = useOmniAural("player.nowPlayingItem") as [NowPlayingItem]
  useOmniAuralEffect(() => {
    console.log("Now: ", OmniAural.state.player.nowPlayingItem.value())
  }, "player.nowPlayingItem")

  const container = classnames(
    "item-info-container"
)

  return (
    <div className={container}>
      <img/>
      <div>
        {nowPlayingItem?.podcastTitle}
        {nowPlayingItem?.episodeTitle}
      </div>
    </div>
  )
}
