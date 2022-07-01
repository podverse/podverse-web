import { GetServerSideProps } from 'next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { ColumnsWrapper, Footer, PageHeader, PageScrollableContent } from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import Script from 'next/script'
import { useTranslation } from 'next-i18next'

type ServerProps = Page

export default function About(props: ServerProps) {
  /* Initialize */
  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player_demo_custom_css}`,
    description: t('pages-embed-player-demo-custom-css_Description'),
    title: t('pages-embed-player-demo-custom-css_Title')
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

      <Script id='pv-override-iframe-variables'>{`
        const pvFrame = document.querySelector('#pv-embed-player').contentWindow;
        const pvSetCSSVariable = (key, value) => pvFrame.document.documentElement.style.setProperty(key, value);

        pvSetCSSVariable('--pv-embed-max-width', 'auto');
        pvSetCSSVariable('--pv-embed-list-max-height', '100vh');

        pvSetCSSVariable('--pv-embed-background-color', '#030626');

        pvSetCSSVariable('--pv-embed-border-color', 'rgba(255, 255, 255, 0.15)');
        pvSetCSSVariable('--pv-embed-divider-color', 'rgba(255, 255, 255, 0.1)');

        pvSetCSSVariable('--pv-embed-font-family', 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif');

        pvSetCSSVariable('--pv-embed-font-size-xxxl', '33px');
        pvSetCSSVariable('--pv-embed-font-size-xxl: 27px');
        pvSetCSSVariable('--pv-embed-font-size-xl', '21px');
        pvSetCSSVariable('--pv-embed-font-size-lg', '19px');
        pvSetCSSVariable('--pv-embed-font-size-md', '16px');
        pvSetCSSVariable('--pv-embed-font-size-sm', '14px');
        pvSetCSSVariable('--pv-embed-font-size-tiny', '12px');
        pvSetCSSVariable('--pv-embed-font-size-tiniest', '9px');

        pvSetCSSVariable('--pv-embed-text-color-primary', '#ffffff');
        pvSetCSSVariable('--pv-embed-text-color-secondary', '#cccccc');
        pvSetCSSVariable('--pv-embed-text-color-tertiary', '#74a8dc');
        pvSetCSSVariable('--pv-embed-text-color-quaternary', '#3d9dfe');

        pvSetCSSVariable('--pv-embed-icon-color', '#cccccc');

        pvSetCSSVariable('--pv-embed-play-button-background-color', '#252a6499');
        pvSetCSSVariable('--pv-embed-play-button-border-color', '#3d9dfe');
        pvSetCSSVariable('--pv-embed-play-button-icon-color', '#ffffff');

        pvSetCSSVariable('--pv-embed-slider-background-color', '#252a64');
        pvSetCSSVariable('--pv-embed-slider-fill-color', '#ffffff');
        pvSetCSSVariable('--pv-embed-slider-marker-color', '#3d9dfe');
        pvSetCSSVariable('--pv-embed-slider-highlight-color', 'rgba(61, 157, 254, 0.5)');

        pvSetCSSVariable('--pv-embed-close-button-background-color', '#0f1235');
        pvSetCSSVariable('--pv-embed-close-button-icon-color', '#ffffff');

        pvSetCSSVariable('--pv-embed-full-screen-background-color', 'rgba(15, 18, 53, 0.4)');
      `}</Script>

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
                src={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player}?episodeId=j6hSyWX93`}
                title='Podcasting 2.0'
              ></iframe>
              <br />
              <br />
              <br />
              <h2>{t('Podcast with all episodes')}</h2>
              <p>{t('Embed podcast with episodes instructions')}</p>
              <iframe
                id='pv-embed-player'
                style={{ border: 0, height: '580px', maxWidth: '600px', width: '100%' }}
                src={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player}?podcastId=peLVTHMwlg`}
                title='Podcasting 2.0'
              ></iframe>
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
