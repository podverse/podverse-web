import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ColumnsWrapper,
  Footer,
  Meta,
  PageHeader,
  PageScrollableContent,
  SideContent,
  TableOfContents
} from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { TutorialSection, TutorialSectionProps } from '~/components/TutorialSection/TutorialSection'
import { mobileAndTabletCheck } from '~/lib/utility/deviceDetection'

type ServerProps = Page

export default function Tutorials(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const items = generateItems(t)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /* useEffects */

  useEffect(() => {
    const isMobileOrTablet = mobileAndTabletCheck()
    setIsMobileOrTablet(isMobileOrTablet)
    setIsLoading(false)
  }, [])

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.tutorials}`,
    description: t('pages-tutorials_Description'),
    title: t('pages-tutorials_Title')
  }

  const generateTutorialSectionElements = () => {
    return items.map((item, index) => (
      <TutorialSection
        defaultTypeSelected={isMobileOrTablet ? 'mobile' : 'web'}
        description={item.description}
        id={item.id}
        key={`tutorial-section-${index}`}
        mobileExplanation={item.mobileExplanation}
        mobilePreviewVideoEmbed={item.mobilePreviewVideoEmbed}
        title={item.title}
        webExplanation={item.webExplanation}
        webPreviewVideoEmbed={item.webPreviewVideoEmbed}
      />
    ))
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader text={t('Tutorials')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <TableOfContents items={items} />
              <hr />
              <div className='tutorial-sections'>
                <h2>Topics</h2>
                {!isLoading && generateTutorialSectionElements()}
              </div>
            </div>
          }
          sideColumnChildren={<SideContent />}
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

const generateItems = (t: any) =>
  [
    {
      title: `Clip - Create`,
      id: `clip-create`,
      description: `Create a clip of the podcast you are listening to that can be shared with anyone. NOTE: If a podcast inserts dynamic ads, then the timestamps of a clip will not stay exactly accurate.`,
      mobileExplanation: `Tap the Miniplayer to expand it, then tap the Scissors at the top of the screen. Here you can create a clip by assigning a start time and an optional end time. Tap the Start Time button to change it to the current time of the episode. Optionally, tap the End Time button when the relevant part of your clip is finished. If you want your clip to remain private, tap the Public button and select Only with Link. Tap Save Clip when you are done. To view your Clips, tap the My Library tab, then tap My Clips.`,
      mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.mobile,
      webExplanation: `TODO:`,
      webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.web
    },
    {
      title: `Clip - Create2`,
      id: `clip-create2`,
      description: `Create a clip of the podcast you are listening to that can be shared with anyone. NOTE: If a podcast inserts dynamic ads, then the timestamps of a clip will not stay exactly accurate.`,
      mobileExplanation: `Tap the Miniplayer to expand it, then tap the Scissors at the top of the screen. Here you can create a clip by assigning a start time and an optional end time. Tap the Start Time button to change it to the current time of the episode. Optionally, tap the End Time button when the relevant part of your clip is finished. If you want your clip to remain private, tap the Public button and select Only with Link. Tap Save Clip when you are done. To view your Clips, tap the My Library tab, then tap My Clips.`,
      mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.mobile,
      webExplanation: `TODO:`,
      webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.web
    },
    {
      title: `Clip - Create3`,
      id: `clip-create3`,
      description: `Create a clip of the podcast you are listening to that can be shared with anyone. NOTE: If a podcast inserts dynamic ads, then the timestamps of a clip will not stay exactly accurate.`,
      mobileExplanation: `Tap the Miniplayer to expand it, then tap the Scissors at the top of the screen. Here you can create a clip by assigning a start time and an optional end time. Tap the Start Time button to change it to the current time of the episode. Optionally, tap the End Time button when the relevant part of your clip is finished. If you want your clip to remain private, tap the Public button and select Only with Link. Tap Save Clip when you are done. To view your Clips, tap the My Library tab, then tap My Clips.`,
      mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.mobile,
      webExplanation: `TODO:`,
      webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.web
    },
    {
      title: `Clip - Create4`,
      id: `clip-create4`,
      description: `Create a clip of the podcast you are listening to that can be shared with anyone. NOTE: If a podcast inserts dynamic ads, then the timestamps of a clip will not stay exactly accurate.`,
      mobileExplanation: `Tap the Miniplayer to expand it, then tap the Scissors at the top of the screen. Here you can create a clip by assigning a start time and an optional end time. Tap the Start Time button to change it to the current time of the episode. Optionally, tap the End Time button when the relevant part of your clip is finished. If you want your clip to remain private, tap the Public button and select Only with Link. Tap Save Clip when you are done. To view your Clips, tap the My Library tab, then tap My Clips.`,
      mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.mobile,
      webExplanation: `TODO:`,
      webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.web
    }
  ] as TutorialSectionProps[]
