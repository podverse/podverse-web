import { Episode, Podcast } from 'podverse-shared'
import { EmbedPlayerListItemEpisode } from './EmbedPlayerListItemEpisode'

type Props = {
  episodes: Episode[]
  keyPrefix: string
  podcast: Podcast
}

export const EmbedPlayerList = ({ episodes, keyPrefix, podcast }: Props) => {
  const generateEpisodeListElements = () => {
    return episodes.map((episode, index) => (
      <EmbedPlayerListItemEpisode episode={episode} key={`${keyPrefix}-${index}-${episode.id}`} podcast={podcast} />
    ))
  }

  return <div className='embed-player-list'>{generateEpisodeListElements()}</div>
}
