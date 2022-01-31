import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural from 'omniaural'
import { convertToNowPlayingItem, MediaRef } from 'podverse-shared'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { TwitterCardPlayer } from '~/components/TwitterCardPlayer/TwitterCardPlayer'
import { TwitterCardPlayerAPIAudio } from '~/components/TwitterCardPlayer/TwitterCardPlayerAPIAudio'
import { useEffect } from 'react'
import { audioIsLoaded, audioLoadNowPlayingItem } from '~/services/player/playerAudio'
import { prefixClipLabel } from '~/lib/utility/misc'
import { getMediaRefById } from '~/services/mediaRef'

interface ServerProps extends Page {
  serverClip: MediaRef
}

// const keyPrefix = 'miniplayer_clip'

/* Player intended for iFrame use, like the Twitter card. */

export default function MiniPlayerClip({ serverClip }: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  useEffect(() => {
    const shouldPlay = false
    const nowPlayingItem = convertToNowPlayingItem(serverClip)
    OmniAural.setPlayerItem(nowPlayingItem)
    if (audioIsLoaded()) {
      const previousNowPlayingItem = null
      audioLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
    }
  }, [])

  /* Meta Tags */

  const { episode } = serverClip
  const podcastTitle =
    (episode && episode.podcast && episode.podcast.title) || prefixClipLabel(t, episode && episode.title)
  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.miniplayer.clip}`,
    description: `${serverClip.episode.title} - ${podcastTitle}`,
    title: serverClip.title || prefixClipLabel(t, episode && episode.title)
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
        twitterPlayerUrl={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.miniplayer.clip}/${serverClip.id}`}
        twitterTitle={meta.title}
      />
      <div className='mini-player-wrapper'>
        <div className='embed-player-outer-wrapper'>
          <div className='info-wrapper'>
            <div className='info-text-wrapper'>
              <div className='episode-title'>{serverClip.title || episode.title || t('untitledClip')}</div>
              <div className='podcast-title'>{podcastTitle}</div>
            </div>
          </div>
          <TwitterCardPlayer isClip />
          <TwitterCardPlayerAPIAudio />
        </div>
      </div>
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
