import PV from '~/lib/constants'

export const homeHeaderButtons = (pageKey, t) => [
  {
    as: PV.paths.web.podcasts,
    href: PV.paths.web.podcasts,
    label: t('Podcasts'),
    isActive: pageKey === PV.pageKeys.podcasts
  },
  {
    as: PV.paths.web.episodes,
    href: PV.paths.web.episodes,
    label: t('Episodes'),
    isActive: pageKey === PV.pageKeys.episodes
  },
  {
    as: PV.paths.web.clips,
    href: PV.paths.web.clips,
    label: t('Clips'),
    isActive: pageKey === PV.pageKeys.clips
  }
]
