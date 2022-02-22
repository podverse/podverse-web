import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural from 'omniaural'
import { convertToNowPlayingItem, Episode } from 'podverse-shared'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { getEpisodeById } from '~/services/episode'
import { TwitterCardPlayer } from '~/components/TwitterCardPlayer/TwitterCardPlayer'
import { TwitterCardPlayerAPIAudio } from '~/components/TwitterCardPlayer/TwitterCardPlayerAPIAudio'
import { useEffect } from 'react'
import { audioIsLoaded, audioLoadNowPlayingItem } from '~/services/player/playerAudio'

interface ServerProps extends Page {
  serverEpisode: Episode
}

// const keyPrefix = 'miniplayer_episode'

/* Player intended for iFrame use, like the Twitter card. */

export default function MiniPlayerEpisode({ serverEpisode }: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  useEffect(() => {
    const shouldPlay = true
    const nowPlayingItem = convertToNowPlayingItem(serverEpisode)
    OmniAural.setPlayerItem(nowPlayingItem)
    if (audioIsLoaded()) {
      const previousNowPlayingItem = null
      audioLoadNowPlayingItem(nowPlayingItem, previousNowPlayingItem, shouldPlay)
    }
  }, [])

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.miniplayer.episode}`,
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
        twitterPlayerUrl={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.miniplayer.episode}/${serverEpisode.id}`}
        twitterTitle={meta.title}
      />
      <div className='mini-player-wrapper'>
        <div className='embed-player-outer-wrapper'>
          <div className='info-wrapper'>
            <div className='info-text-wrapper'>
              <div className='episode-title'>{serverEpisode.title || t('untitledEpisode')}</div>
              <div className='podcast-title'>{serverEpisode.podcast.title || t('untitledPodcast')}</div>
            </div>
          </div>
          <TwitterCardPlayer isClip={false} />
          <TwitterCardPlayerAPIAudio />
        </div>
      </div>
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
