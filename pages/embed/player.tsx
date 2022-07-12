import { GetServerSideProps } from 'next'
import { useOmniAural } from 'omniaural'
import { convertToNowPlayingItem, Episode, Podcast } from 'podverse-shared'
import { I18nPage } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultEmbedServerSideProps } from '~/services/serverSideHelpers'
import { TwitterCardPlayerAPIAudio } from '~/components/TwitterCardPlayer/TwitterCardPlayerAPIAudio'
import { useEffect, useState } from 'react'
import { EmbedPlayerHeader, EmbedPlayerList, EmbedPlayerWrapper } from '~/components'
import { PlayerFullView } from '~/components/Player/PlayerFullView'
import { getPodcastById } from '~/services/podcast'
import { getEpisodesAndLiveItems } from '~/services/liveItem'
import { playerLoadNowPlayingItem } from '~/services/player/player'
import { OmniAuralState } from '~/state/omniauralState'
import { getEpisodeById, getEpisodeByPodcastIdAndGuid, getEpisodeByPodcastIdAndMediaUrl } from '~/services/episode'

interface ServerProps extends I18nPage {
  episodeGuid?: string
  episodeId?: string
  episodeMediaUrl?: string
  episodePubDate?: Date
  episodeTitle?: string
  podcastId?: string
  showAllEpisodes?: boolean
}

const keyPrefix = 'embed_player'

/* Embeddable Player intended for iFrame use */

export default function EmbedPlayerPage({
  episodeGuid,
  episodeId,
  episodeMediaUrl,
  episodePubDate,
  episodeTitle,
  podcastId,
  showAllEpisodes
}: ServerProps) {
  /* Initialize */
  const [hasInitialized, setHasInitialized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [podcast, setPodcast] = useState<Podcast>(null)
  const [player] = useOmniAural('player') as [OmniAuralState['player']]
  const { currentNowPlayingItem } = player
  const episodeOnly = !!episodeId && !podcastId

  /* useEffects */

  useEffect(() => {
    initializeData()
  }, [])

  /* Helpers */

  const initializeData = async () => {
    parent.postMessage('pv-embed-has-loaded', '*')
    setTimeout(async () => {
      setHasInitialized(true)

      const serverEpisodesFilterSort = PV.Filters.sort._mostRecent
      const serverEpisodesFilterPage = 1

      let podcast = null
      let episodes = []
      let episode = null

      if (podcastId) {
        podcast = (await getPodcastById(podcastId)).data
        setPodcast(podcast)
        const data = await getEpisodesAndLiveItems(
          {
            podcastIds: podcastId,
            sort: serverEpisodesFilterSort,
            maxResults: true
          },
          podcast,
          serverEpisodesFilterPage
        )

        const [combinedEpisodesData] = data.combinedEpisodes
        episodes = combinedEpisodesData
      }

      if (episodeId) {
        episode = (await getEpisodeById(episodeId)).data
      }

      if (!episode && podcast?.embedApprovedMediaUrlPaths && episodeMediaUrl) {
        const isApprovedMediaUrl = podcast.embedApprovedMediaUrlPaths
          .split(',')
          .some((x) => episodeMediaUrl.startsWith(x))
        if (!isApprovedMediaUrl) {
          console.error('Episode media url path not found in approved media urls paths.')
        } else {
          if (!episode && episodeGuid && podcastId) {
            try {
              episode = (await getEpisodeByPodcastIdAndGuid(podcastId, episodeGuid)).data
            } catch (error) {
              console.log('Episode not found by GUID.')
            }
          }

          if (!episode && episodeMediaUrl && podcastId) {
            try {
              episode = (await getEpisodeByPodcastIdAndMediaUrl(podcastId, episodeMediaUrl)).data
            } catch (error) {
              console.log('Episode not found by media url.')
            }
          }

          if (!episode && (episodeGuid || episodeMediaUrl)) {
            episode = {
              guid: episodeGuid,
              id: episodeId,
              mediaUrl: episodeMediaUrl,
              pubDate: (episodePubDate && new Date(Number(episodePubDate) * 1000)) || new Date(),
              title: episodeTitle
            } as Episode

            if (showAllEpisodes) {
              episodes.unshift(episode)
            }
          }
        }
      }

      if (!episode && showAllEpisodes && episodes.length > 0) {
        episode = episodes[0]
      }

      const shouldPlay = true
      const inheritedEpisode = null
      const nowPlayingItem = convertToNowPlayingItem(episode, inheritedEpisode, podcast)
      const previousNowPlayingItem = null
      await playerLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
      setEpisodes(episodes)
      setIsLoading(false)
    }, 100)
  }

  return (
    <>
      <Meta robotsNoIndex={true} />
      <EmbedPlayerWrapper episodeOnly={episodeOnly} hasInitialized={hasInitialized} isLoading={isLoading}>
        <EmbedPlayerHeader hideFullView={episodeOnly} />
        {!episodeOnly && <EmbedPlayerList episodes={episodes} keyPrefix={keyPrefix} podcast={podcast} />}
        {currentNowPlayingItem && <PlayerFullView isEmbed nowPlayingItem={currentNowPlayingItem} />}
      </EmbedPlayerWrapper>
      <TwitterCardPlayerAPIAudio shouldLoadChapters />
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, query } = ctx
  const {
    episodeGuid,
    episodeId,
    episodeMediaUrl,
    episodePubDate,
    episodeTitle,
    podcastId,
    podcastTitle,
    showAllEpisodes
  } = query as any

  const defaultServerProps = await getDefaultEmbedServerSideProps(ctx, locale)

  const props: ServerProps = {
    ...defaultServerProps,
    ...(episodeGuid ? { episodeGuid } : {}),
    ...(episodeId ? { episodeId } : {}),
    ...(episodeMediaUrl ? { episodeMediaUrl } : {}),
    ...(episodePubDate ? { episodePubDate } : {}),
    ...(episodeTitle ? { episodeTitle } : {}),
    ...(podcastId ? { podcastId } : {}),
    ...(podcastTitle ? { podcastTitle } : {}),
    showAllEpisodes: showAllEpisodes ? showAllEpisodes.toLowerCase() === 'true' : false
  }

  return { props }
}
