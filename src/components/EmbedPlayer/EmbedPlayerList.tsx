import { Episode } from "podverse-shared"
import { EmbedPlayerListItemEpisode } from "./EmbedPlayerListItemEpisode"

type Props = {
  episodes: Episode[]
  keyPrefix: string
}

export const EmbedPlayerList = ({ episodes, keyPrefix }: Props) => {

  const generateEpisodeListElements = () => {
    return episodes.map((episode, index) => (
      <EmbedPlayerListItemEpisode
        episode={episode}
        key={`${keyPrefix}-${index}-${episode.id}`} />
    ))
  }

  return (
    <div className='embed-player-list'>
      {generateEpisodeListElements()}
    </div>
  )
}
