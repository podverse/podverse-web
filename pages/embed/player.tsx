import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural from 'omniaural'
import { convertToNowPlayingItem, Episode, MediaRef, NowPlayingItem, Podcast } from 'podverse-shared'
import { I18nPage } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultEmbedServerSideProps } from '~/services/serverSideHelpers'
import { TwitterCardPlayer } from '~/components/TwitterCardPlayer/TwitterCardPlayer'
import { TwitterCardPlayerAPIAudio } from '~/components/TwitterCardPlayer/TwitterCardPlayerAPIAudio'
import { useEffect } from 'react'
import { audioIsLoaded, audioLoadNowPlayingItem } from '~/services/player/playerAudio'
import { prefixClipLabel } from '~/lib/utility/misc'
import { getMediaRefById } from '~/services/mediaRef'
import { EmbedPlayerFooter, EmbedPlayerHeader, EmbedPlayerList, EmbedPlayerWrapper } from '~/components'
import { PlayerFullView } from '~/components/Player/PlayerFullView'
import { getPodcastById } from '~/services/podcast'
import { getEpisodesAndLiveItems } from '~/services/liveItem'

interface ServerProps extends I18nPage {
  serverEpisode?: Episode
  serverEpisodes: Episode[]
  serverPodcast: Podcast
}

const keyPrefix = 'embed_player'

/* Embeddable Player intended for iFrame use */

export default function EmbedPlayerPage({ serverEpisode, serverEpisodes, serverPodcast }: ServerProps) {
  /* useEffects */

  useEffect(() => {
    const shouldPlay = true
    const inheritedEpisode = null
    const nowPlayingItem = convertToNowPlayingItem(serverEpisode, inheritedEpisode, serverPodcast)
    OmniAural.setPlayerItem(nowPlayingItem)
    if (audioIsLoaded()) {
      const previousNowPlayingItem = null
      audioLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
    }
  }, [])

  return (
    <>
      <Meta robotsNoIndex={true} />
      <EmbedPlayerWrapper>
        <EmbedPlayerHeader />
        <EmbedPlayerList episodes={serverEpisodes} keyPrefix={keyPrefix}  />
      </EmbedPlayerWrapper>
      {/* <PlayerFullView /> */}
      <TwitterCardPlayerAPIAudio shouldLoadChapters />
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const { podcastId } = query
  
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
        sort: serverFilterSort
      },
      serverPodcast,
      serverFilterPage
    )

    const [combinedEpisodesData] = data.combinedEpisodes
    serverEpisodes = combinedEpisodesData
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
