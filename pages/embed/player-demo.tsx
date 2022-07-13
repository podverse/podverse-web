import { GetServerSideProps } from 'next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, PageHeader, PageScrollableContent, PVLink } from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { useTranslation } from 'next-i18next'

type ServerProps = Page

export default function EmbedPlayerDemo(props: ServerProps) {
  /* Initialize */
  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player_demo}`,
    description: t('pages-embed-player-demo_Description'),
    title: t('pages-embed-player-demo_Title')
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
        twitterTitle={meta.title}
      />
      <PageHeader text={meta.title} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <h2>{t('Episode only')}</h2>
              <p>{t('Embed episode only instructions')}</p>
              <iframe
                id='pv-embed-player'
                style={{ border: 0, height: '170px', maxWidth: '600px', width: '100%' }}
                src={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player}?episodeId=kilYJsW3A`}
                title='Podverse Embed Player'
              ></iframe>
              <br />
              <br />
              <br />
              <h2>{t('Podcast with all episodes')}</h2>
              <p>{t('Embed podcast with episodes instructions')}</p>
              <iframe
                id='pv-embed-player'
                style={{ border: 0, height: '580px', maxWidth: '600px', width: '100%' }}
                src={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player}?podcastId=g40Um-HP1&showAllEpisodes=true`}
                title='Podverse Embed Player'
              ></iframe>
              <br />
              <br />
              <br />
              <h2>{t('Custom CSS styles')}</h2>
              <p>{t('Embed custom CSS intro instructions')}</p>
              <p>
                {t('Demo')}:{' '}
                <PVLink
                  href={PV.RoutePaths.web.embed.player_demo_custom_css}
                >{`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player_demo_custom_css}`}</PVLink>
              </p>
              <br />
              <br />
              <br />
            </div>
          }
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
