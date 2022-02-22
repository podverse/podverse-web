import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural from 'omniaural'
import { convertToNowPlayingItem, MediaRef } from 'podverse-shared'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { useEffect } from 'react'
import { prefixClipLabel } from '~/lib/utility/misc'
import { getMediaRefById } from '~/services/mediaRef'
import { videoLoadNowPlayingItem } from '~/services/player/playerVideo'
import { TwitterCardPlayerAPIVideo } from '~/components/TwitterCardPlayer/TwitterCardPlayerAPIVideo'

interface ServerProps extends Page {
  serverClip: MediaRef
}

// const keyPrefix = 'videoplayer_clip'

/* Player intended for iFrame use, like the Twitter card. */

export default function VideoPlayerClip({ serverClip }: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  useEffect(() => {
    const shouldPlay = true
    const nowPlayingItem = convertToNowPlayingItem(serverClip)
    OmniAural.setPlayerItem(nowPlayingItem)
    const previousNowPlayingItem = null
    videoLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
  }, [])

  /* Meta Tags */

  const { episode } = serverClip
  const podcastTitle =
    (episode && episode.podcast && episode.podcast.title) || prefixClipLabel(t, episode && episode.title)
  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.videoplayer.clip}`,
    description: `${serverClip.episode.title} - ${podcastTitle}`,
    title: serverClip.title || prefixClipLabel(t, episode && episode.title)
  }

  return (
    <>
      <Meta
        description={meta.description}
        isVideo
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={true}
        title={meta.title}
        twitterDescription={meta.description}
        twitterPlayerUrl={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.videoplayer.clip}/${serverClip.id}`}
        twitterTitle={meta.title}
      />
      <TwitterCardPlayerAPIVideo />
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx
  const { clipId } = params

  const [defaultServerProps, clipResponse] = await Promise.all([
    getDefaultServerSideProps(ctx, locale),
    getMediaRefById(clipId as string)
  ])

  const serverClip = clipResponse.data

  const props: ServerProps = {
    ...defaultServerProps,
    serverClip
  }

  return { props }
}
