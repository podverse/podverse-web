import type { Podcast } from 'podverse-shared'

type Props = {
  podcast: Podcast
}

export const PodcastListItem = ({ podcast }: Props) => {
  const { lastEpisodePubDate, title } = podcast
  
  return (
    <article className='podcast-list-item'>
      <div className='title'>{title}</div>
      <div className='last-episode-pub-date'>{lastEpisodePubDate}</div>
    </article>
  )
}
