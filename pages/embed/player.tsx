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
      <EmbedPlayerWrapper>
        <EmbedPlayerHeader />
        <EmbedPlayerList episodes={serverEpisodes} keyPrefix={keyPrefix} />
      </EmbedPlayerWrapper>
      {currentNowPlayingItem && <PlayerFullView isEmbed nowPlayingItem={currentNowPlayingItem} />}
      <TwitterCardPlayerAPIAudio shouldLoadChapters />
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const { episodeId, podcastId } = query

  const [defaultServerProps, podcastResponse] = await Promise.all([
    getDefaultEmbedServerSideProps(ctx, locale),
    getPodcastById(podcastId as string)
  ])

  const serverPodcast = podcastResponse.data

  const serverFilterType = PV.Filters.type._episodes
  const serverFilterSort = PV.Filters.sort._mostRecent
  const serverFilterPage = 1

  let serverEpisodes = []
  let serverEpisode = null

  if (serverFilterType === PV.Filters.type._episodes) {
    const data = await getEpisodesAndLiveItems(
      {
        podcastIds: podcastId,
        sort: serverFilterSort,
        maxResults: true
      },
      serverPodcast,
      serverFilterPage
    )

    const [combinedEpisodesData] = data.combinedEpisodes
    serverEpisodes = combinedEpisodesData

    if (episodeId) {
      serverEpisode = (await getEpisodeById(episodeId as string)).data
    } else {
      serverEpisode = serverEpisodes[0]
    }
  }

  const props: ServerProps = {
    ...defaultServerProps,
    serverEpisode,
    serverEpisodes,
    serverPodcast
  }

  return { props }
}
