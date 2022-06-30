import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ColumnsWrapper,
  DownloadAppButtons,
  FeatureComparisonTable,
  Footer,
  PageHeader,
  PageScrollableContent
} from '~/components'
import { Meta } from '~/components/Meta/Meta'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

export default function About(props: ServerProps) {
  /* Initialize */

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player_demo}`,
    description: 'A demo of the embeddable Podverse player.',
    title: 'Podverse Embed Demo'
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
              <br />
              <p><b>Sample iframe code:</b></p>
              <p>&lt;iframe style="height: 580px; max-width: 600px; width: 100%; border: 0;" src="https://podverse.fm/embed/player?podcastId=peLVTHMwlg&episodeId=j6hSyWX93" title="Podcasting 2.0"&gt;&lt;/iframe&gt;</p>
              <br />
              <iframe style={{ border: 0, height: '580px', maxWidth: '600px', width: '100%' }} src={`${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.embed.player}?podcastId=peLVTHMwlg&episodeId=j6hSyWX93`} title="Podcasting 2.0"></iframe>
              <br />
              <br />
              <br />
              <p><b>More info:</b></p>
              <p>podcastId is required.</p>
              <p>To preload a specific episode, set the episodeId.</p>
              <p>Adjust the height and max-width as needed for your site.</p>
              <br />
              <br />
            </div>
          }
        />
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
