import { useTranslation } from "next-i18next"
import { ComparisonTable } from "../ComparisonTable/ComparisonTable"

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
    icon2: true
  },
  {
    text: t('features - download episodes'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - add custom rss feeds'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - video playback'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - sleep timer'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - podcasting 2.0 chapters'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - podcasting 2.0 cross-app comments'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - podcasting 2.0 transcripts'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - opml import and export'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - screen-reader accessibility'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - Sync your subscriptions, queue, and history across all your devices'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - create and share podcast clips'),
    icon1: false,
    icon2: true
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
