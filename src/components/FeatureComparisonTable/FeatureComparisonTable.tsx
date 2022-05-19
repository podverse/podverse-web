import { useTranslation } from 'next-i18next'
import { ComparisonTable } from '../ComparisonTable/ComparisonTable'

type Props = {
  aboveSectionNodes?: any
  leftAlignedStyle?: boolean
}

export function FeatureComparisonTable({ aboveSectionNodes, leftAlignedStyle }: Props) {
  const { t } = useTranslation()

  return (
    <ComparisonTable
      aboveSectionNodes={aboveSectionNodes}
      featuresData={featuresData(t)}
      headerText1={t('Free')}
      headerText2={t('Premium')}
      headerText={t('Features')}
      leftAlignedStyle={leftAlignedStyle}
      legendAsterisk={t('Feature is only available in the mobile app')}
    />
  )
}

const featuresData = (t) => [
  {
    text: t('features - subscribe to podcasts'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    previewVideoEmbed: {
      text: t('features - subscribe to podcasts'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/60a4ba13-9e15-4f47-8e93-ba29e9bc7b27'
    }
  },
  {
    text: t('features - download episodes'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - audio livestreams'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - video playback'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - add custom rss feeds'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - sleep timer'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - screen-reader accessibility'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - podcasting 2.0 chapters'),
    icon1: true,
    icon2: true,
    width: 560,
    height: 315,
    src: 'https://peertube.podverse.fm/videos/embed/b34c5f55-bce7-43de-bd63-5ceb2800dbd1'
  },
  {
    text: t('features - podcasting 2.0 cross-app comments'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - podcasting 2.0 transcripts'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - opml import and export'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - Sync your subscriptions, queue, and history across all your devices'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - new episodes and livestream notifications'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - create and share podcast clips'),
    icon1: false,
    icon2: true,
    width: 560,
    height: 315,
    src: 'https://peertube.podverse.fm/videos/embed/a7865ef0-83bd-4ba1-ab6a-2e54fd738d11'
  },
  {
    text: t('features - create and share playlists'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - mark episodes as played'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - subscribe to listener profiles'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - support open source software'),
    icon1: true,
    icon2: true,
    iconType: 'smile'
  }
]
