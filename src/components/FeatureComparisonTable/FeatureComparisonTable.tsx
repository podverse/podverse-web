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
    icon2: true,
    previewVideoEmbed: {
      text: t('features - audio livestreams'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/bbf6eb1c-46a0-407d-b1ef-682590885882'
    }
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
    icon2Asterisk: true,
    previewVideoEmbed: {
      text: t('features - sleep timer'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/9bd98b86-7e9a-4c70-b52d-b6e2f5909749'
    }
  },
  {
    text: t('Send Bitcoin donations and boostagrams to podcasters'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true,
    previewVideoEmbed: {
      text: t('Send Bitcoin donations and boostagrams to podcasters'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/a1dbaedf-560c-40df-93c5-79a3a3be8f81'
    }
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
    previewVideoEmbed: {
      text: t('features - podcasting 2.0 chapters'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/b34c5f55-bce7-43de-bd63-5ceb2800dbd1'
    }
  },
  {
    text: t('features - podcasting 2.0 cross-app comments'),
    icon1: true,
    icon2: true,
    previewVideoEmbed: {
      text: t('features - podcasting 2.0 cross-app comments'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/ed6771e1-2b64-4180-9235-b59ff3308b49'
    }
  },
  {
    text: t('features - podcasting 2.0 transcripts'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true,
    previewVideoEmbed: {
      text: t('features - podcasting 2.0 transcripts'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/e02afb1e-5426-4377-88bf-86ebbb9edd9c'
    }
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
    icon2: true,
    previewVideoEmbed: {
      text: t('features - Sync your subscriptions, queue, and history across all your devices'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/b5a0ca7e-76c0-4b5e-9aa8-31f14505dcee'
    }
  },
  {
    text: t('features - new episodes and livestream notifications'),
    icon1: true,
    icon1Asterisk: true,
    icon2: true,
    icon2Asterisk: true,
    previewVideoEmbed: {
      text: t('features - new episodes and livestream notifications'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/bbf6eb1c-46a0-407d-b1ef-682590885882'
    }
  },
  {
    text: t('features - create and share podcast clips'),
    icon1: false,
    icon2: true,
    previewVideoEmbed: {
      text: t('features - create and share podcast clips'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/67764a9d-12e0-4c25-9ae8-746efe484fa2'
    }
  },
  {
    text: t('features - create and share playlists'),
    icon1: false,
    icon2: true,
    previewVideoEmbed: {
      text: t('features - create and share playlists'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/7944971b-9f5b-4d17-9192-9bed76d4face
    }
  },
  {
    text: t('features - mark episodes as played'),
    icon1: false,
    icon2: true
  },
  {
    text: t('features - subscribe to listener profiles'),
    icon1: false,
    icon2: true,
    previewVideoEmbed: {
      text: t('features - subscribe to listener profiles'),
      width: 560,
      height: 315,
      src: 'https://peertube.podverse.fm/videos/embed/115fe6f5-f182-4c3b-86ab-5c245adef77e'
    }
  },
  {
    text: t('features - support open source software'),
    icon1: true,
    icon2: true,
    iconType: 'smile'
  }
]
