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

      <Script defer id='pv-override-iframe-variables'>{`
        function pvHandleCSSOverrides(e) {
          const key = e.message ? "message" : "data";
          const data = e[key];
  
          if (data == 'pv-embed-has-loaded') {
            const pvFrameNode = document.querySelector('#pv-embed-player');
            const pvFrameNode2 = document.querySelector('#pv-embed-player-2');

            if (pvFrameNode && pvFrameNode2) {
              const pvSetCSSVariable = (key, value) => {
                pvFrameNode.contentWindow.document.documentElement.style.setProperty(key, value);
                pvFrameNode2.contentWindow.document.documentElement.style.setProperty(key, value);
              };
      
              pvSetCSSVariable('--pv-embed-max-width', 'auto');
              pvSetCSSVariable('--pv-embed-list-max-height', '100vh');
      
              pvSetCSSVariable('--pv-embed-background-color', '#ffffff');
      
              pvSetCSSVariable('--pv-embed-border-color', 'rgba(0, 0, 0, 0.1)');
              pvSetCSSVariable('--pv-embed-divider-color', 'rgba(255, 255, 255, 0.2)');
      
              pvSetCSSVariable('--pv-embed-font-family', 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif');
      
              pvSetCSSVariable('--pv-embed-font-size-xxxl', '33px');
              pvSetCSSVariable('--pv-embed-font-size-xxl: 27px');
              pvSetCSSVariable('--pv-embed-font-size-xl', '21px');
              pvSetCSSVariable('--pv-embed-font-size-lg', '19px');
              pvSetCSSVariable('--pv-embed-font-size-md', '16px');
              pvSetCSSVariable('--pv-embed-font-size-sm', '14px');
              pvSetCSSVariable('--pv-embed-font-size-tiny', '12px');
              pvSetCSSVariable('--pv-embed-font-size-tiniest', '9px');
      
              pvSetCSSVariable('--pv-embed-text-color-primary', '#2d2d2d');
              pvSetCSSVariable('--pv-embed-text-color-secondary', '#333333');
              pvSetCSSVariable('--pv-embed-text-color-tertiary', '#868686');
              pvSetCSSVariable('--pv-embed-text-color-quaternary', '#e90000');
      
              pvSetCSSVariable('--pv-embed-icon-color', '#676767');
      
              pvSetCSSVariable('--pv-embed-play-button-background-color', '#f7f7f799');
              pvSetCSSVariable('--pv-embed-play-button-border-color', '#676767');
              pvSetCSSVariable('--pv-embed-play-button-icon-color', '#676767');
      
              pvSetCSSVariable('--pv-embed-slider-background-color', 'rgba(221,221,221,.5)');
              pvSetCSSVariable('--pv-embed-slider-fill-color', '#aaaaaa');
              pvSetCSSVariable('--pv-embed-slider-marker-color', '#e90000');
              pvSetCSSVariable('--pv-embed-slider-highlight-color', 'rgba(233, 0, 0, 0.5)');
      
              pvSetCSSVariable('--pv-embed-close-button-background-color', '#cccccc');
              pvSetCSSVariable('--pv-embed-close-button-icon-color', '#333333');
      
              pvSetCSSVariable('--pv-embed-full-screen-background-color', 'rgba(255, 255, 255, 0.2)');
            }
          }
        }

        window.addEventListener('message', pvHandleCSSOverrides);
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
                title='Podverse Embed Player'
              ></iframe>
              <br />
              <br />
              <br />
              <h2>{t('Podcast with all episodes')}</h2>
              <p>{t('Embed podcast with episodes instructions')}</p>
              <iframe
                id='pv-embed-player-2'
                style={{ border: 0, height: '580px', maxWidth: '600px', width: '100%' }}
                src={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player}?podcastId=peLVTHMwlg&showAllEpisodes=true`}
                title='Poverse Embed Player'
              ></iframe>
              <br />
              <br />
              <br />
              <h2>{t('How To')}</h2>
              <p>{t('Embed custom CSS instructions')}</p>
              <code>{`<script>
  function pvHandleCSSOverrides(e) {
    const key = e.message ? "message" : "data";
    const data = e[key];

    if (data == 'pv-embed-has-loaded') {
      const pvFrameNode = document.querySelector('#pv-embed-player');

      if (pvFrameNode) {
        const pvSetCSSVariable = (key, value) => {
          pvFrameNode.contentWindow.document.documentElement.style.setProperty(key, value);
        };

        pvSetCSSVariable('--pv-embed-max-width', 'auto');
        pvSetCSSVariable('--pv-embed-list-max-height', '100vh');

        pvSetCSSVariable('--pv-embed-background-color', '#ffffff');

        pvSetCSSVariable('--pv-embed-border-color', 'rgba(0, 0, 0, 0.1)');
        pvSetCSSVariable('--pv-embed-divider-color', 'rgba(255, 255, 255, 0.2)');

        pvSetCSSVariable('--pv-embed-font-family', 'Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif');

        pvSetCSSVariable('--pv-embed-font-size-xxxl', '33px');
        pvSetCSSVariable('--pv-embed-font-size-xxl: 27px');
        pvSetCSSVariable('--pv-embed-font-size-xl', '21px');
        pvSetCSSVariable('--pv-embed-font-size-lg', '19px');
        pvSetCSSVariable('--pv-embed-font-size-md', '16px');
        pvSetCSSVariable('--pv-embed-font-size-sm', '14px');
        pvSetCSSVariable('--pv-embed-font-size-tiny', '12px');
        pvSetCSSVariable('--pv-embed-font-size-tiniest', '9px');

        pvSetCSSVariable('--pv-embed-text-color-primary', '#2d2d2d');
        pvSetCSSVariable('--pv-embed-text-color-secondary', '#333333');
        pvSetCSSVariable('--pv-embed-text-color-tertiary', '#868686');
        pvSetCSSVariable('--pv-embed-text-color-quaternary', '#e90000');

        pvSetCSSVariable('--pv-embed-icon-color', '#676767');

        pvSetCSSVariable('--pv-embed-play-button-background-color', '#f7f7f799');
        pvSetCSSVariable('--pv-embed-play-button-border-color', '#676767');
        pvSetCSSVariable('--pv-embed-play-button-icon-color', '#676767');

        pvSetCSSVariable('--pv-embed-slider-background-color', 'rgba(221,221,221,.5)');
        pvSetCSSVariable('--pv-embed-slider-fill-color', '#aaaaaa');
        pvSetCSSVariable('--pv-embed-slider-marker-color', '#e90000');
        pvSetCSSVariable('--pv-embed-slider-highlight-color', 'rgba(233, 0, 0, 0.5)');

        pvSetCSSVariable('--pv-embed-close-button-background-color', '#cccccc');
        pvSetCSSVariable('--pv-embed-close-button-icon-color', '#333333');

        pvSetCSSVariable('--pv-embed-full-screen-background-color', 'rgba(255, 255, 255, 0.2)');
      }
    }
  }

  window.addEventListener('message', pvHandleCSSOverrides);
</script>`}</code>
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
