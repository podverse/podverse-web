import { GetServerSideProps } from 'next'
import { useOmniAural } from 'omniaural'
import { convertToNowPlayingItem, Episode, Podcast } from 'podverse-shared'
import { I18nPage } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultEmbedServerSideProps } from '~/services/serverSideHelpers'
import { TwitterCardPlayerAPIAudio } from '~/components/TwitterCardPlayer/TwitterCardPlayerAPIAudio'
import { useEffect } from 'react'
import { EmbedPlayerHeader, EmbedPlayerList, EmbedPlayerWrapper } from '~/components'
import { PlayerFullView } from '~/components/Player/PlayerFullView'
import { getPodcastById } from '~/services/podcast'
import { getEpisodesAndLiveItems } from '~/services/liveItem'
import { playerLoadNowPlayingItem } from '~/services/player/player'
import { OmniAuralState } from '~/state/omniauralState'
import { getEpisodeById } from '~/services/episode'

interface ServerProps extends I18nPage {
  serverEpisode?: Episode
  serverEpisodes: Episode[]
  serverPodcast: Podcast
}

const keyPrefix = 'embed_player'

/* Embeddable Player intended for iFrame use */

export default function EmbedPlayerPage({ serverEpisode, serverEpisodes, serverPodcast }: ServerProps) {
  /* Initialize */
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { currentNowPlayingItem } = player
  const episodeOnly = serverEpisodes.length === 0

  /* useEffects */

  useEffect(() => {
    const shouldPlay = true
    const inheritedEpisode = null
    const nowPlayingItem = convertToNowPlayingItem(serverEpisode, inheritedEpisode, serverPodcast)
    const previousNowPlayingItem = null
    playerLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
  }, [])

  return (
    <>
      <Meta robotsNoIndex={true} />
      <EmbedPlayerWrapper episodeOnly={episodeOnly}>
        <EmbedPlayerHeader hideFullView={episodeOnly} />
        {!episodeOnly && <EmbedPlayerList episodes={serverEpisodes} keyPrefix={keyPrefix} />}
        {currentNowPlayingItem && <PlayerFullView isEmbed nowPlayingItem={currentNowPlayingItem} />}
      </EmbedPlayerWrapper>
      <TwitterCardPlayerAPIAudio shouldLoadChapters />
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const { episodeId, podcastId } = query

  const serverEpisodesFilterSort = PV.Filters.sort._mostRecent
  const serverEpisodesFilterPage = 1

  let serverPodcast = null
  let serverEpisodes = []
  let serverEpisode = null

  const defaultServerProps = await getDefaultEmbedServerSideProps(ctx, locale)

  if (podcastId) {
    serverPodcast = (await getPodcastById(podcastId as string)).data
    const data = await getEpisodesAndLiveItems(
      {
        podcastIds: podcastId,
        sort: serverEpisodesFilterSort,
        maxResults: true
      },
      serverPodcast,
      serverEpisodesFilterPage
    )

    const [combinedEpisodesData] = data.combinedEpisodes
    serverEpisodes = combinedEpisodesData
  }

  if (episodeId) {
    serverEpisode = (await getEpisodeById(episodeId as string)).data
  } else if (serverEpisodes.length > 0) {
    serverEpisode = serverEpisodes[0]
  }

  const props: ServerProps = {
    ...defaultServerProps,
    serverEpisode,
    serverEpisodes,
    serverPodcast
  }

  return { props }
}
