import { GetServerSideProps } from 'next'
import OmniAural from 'omniaural'
import { convertToNowPlayingItem, Episode } from 'podverse-shared'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { getEpisodeById } from '~/services/episode'
import { useEffect } from 'react'
import { videoLoadNowPlayingItem } from '~/services/player/playerVideo'
import { TwitterCardPlayerAPIVideo } from '~/components/TwitterCardPlayer/TwitterCardPlayerAPIVideo'

interface ServerProps extends Page {
  serverEpisode: Episode
}

// const keyPrefix = 'videoplayer_episode'

/* Player intended for iFrame use, like the Twitter card. */

export default function VideoPlayerEpisode({ serverEpisode }: ServerProps) {
  /* Initialize */

  useEffect(() => {
    const shouldPlay = false
    const nowPlayingItem = convertToNowPlayingItem(serverEpisode)
    OmniAural.setPlayerItem(nowPlayingItem)
    const previousNowPlayingItem = null
    videoLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
  }, [])

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.videoplayer.episode}`,
    description: serverEpisode.description,
    title: serverEpisode.title
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={true}
        title={meta.title}
        twitterDescription={meta.description}
        twitterPlayerUrl={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.videoplayer.episode}/${serverEpisode.id}`}
        twitterTitle={meta.title}
      />
      <TwitterCardPlayerAPIVideo />
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx
  const { episodeId } = params

  const [defaultServerProps, episodeResponse] = await Promise.all([
    getDefaultServerSideProps(ctx, locale),
    getEpisodeById(episodeId as string)
  ])

  const serverEpisode = episodeResponse.data

  const props: ServerProps = {
    ...defaultServerProps,
    serverEpisode
  }

  return { props }
}
