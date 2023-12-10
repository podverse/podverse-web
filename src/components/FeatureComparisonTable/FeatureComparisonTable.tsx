import { useTranslation } from 'next-i18next'
import { ComparisonTable } from '../ComparisonTable/ComparisonTable'
import { PV } from '~/resources'

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
      // legendAsterisk2={t('Feature is only available on the website')}
    />
  )
}

const featuresData = (t) => [
  {
    text: t('features - subscribe to podcasts'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).podcasts.subscribe.web
  },
  {
    text: t('features - download episodes'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).episodes.download.mobile
  },
  {
    text: t('features - video playback'),
    icon1: true,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).videos.web
  },
  {
    text: t('features - livestreams'),
    icon1: true,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).liveStreams.audio.mobile
  },
  {
    text: t('features - apple carplay'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - value for value boostagrams'),
    icon1: true,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).value4Value.bitcoin.web
  },
  {
    text: t('features - value for value streaming'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true
  },
  {
    text: t('features - podcasting 2.0 chapters'),
    icon1: true,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).chapters.web
  },
  {
    text: t('features - podcasting 2.0 cross-app comments'),
    icon1: true,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).crossAppComments.web
  },
  {
    text: t('features - podcasting 2.0 transcripts'),
    icon1: true,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).transcripts.web
  },
  {
    text: t('features - add custom rss feeds'),
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
    text: t('features - sleep timer'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).sleepTimer.mobile
  },
  {
    text: t('features - screen-reader accessibility'),
    icon1: true,
    icon2: true
  },
  {
    text: t('features - Sync your subscriptions, queue, and history across all your devices'),
    icon1: false,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).sync
  },
  {
    text: t('features - new episodes and livestream notifications'),
    icon1: false,
    icon1Asterisk: false,
    icon2: true,
    icon2Asterisk: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).notifications.mobile
  },
  {
    text: t('features - create and share podcast clips'),
    icon1: false,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.web
  },
  {
    text: t('features - create and share playlists'),
    icon1: false,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).playlists.create.web
  },
  {
    text: t('features - mark episodes as played'),
    icon1: false,
    icon2: true,
    PreviewVideoEmbed: PV.PreviewVideoEmbeds(t).markAsPlayed.web
  },
  {
    text: t('features - subscribe to listener profiles'),
    icon1: false,
    icon2: true,
    previewVideoEmbed: PV.PreviewVideoEmbeds(t).profiles.subscribe.web
  },
  {
    text: t('features - support open source software'),
    icon1: true,
    icon2: true,
    iconType: 'smile'
  }
]
