import PV from '~/lib/constants'
import { setCookie } from '~/lib/utility'

export const homeHeaderButtons = (pageKey, t) => [
  {
    as: PV.paths.web.podcasts,
    href: PV.paths.web.podcasts,
    label: t('Podcasts'),
    isActive: pageKey === PV.pageKeys.podcasts,
    onClick: () => setCookie(PV.cookies.lastVisitedHomepageTab, PV.pageKeys.podcasts)
  },
  {
    as: PV.paths.web.episodes,
    href: PV.paths.web.episodes,
    label: t('Episodes'),
    isActive: pageKey === PV.pageKeys.episodes,
    onClick: () => setCookie(PV.cookies.lastVisitedHomepageTab, PV.pageKeys.episodes)
  },
  {
    as: PV.paths.web.clips,
    href: PV.paths.web.clips,
    label: t('Clips'),
    isActive: pageKey === PV.pageKeys.clips,
    onClick: () => setCookie(PV.cookies.lastVisitedHomepageTab, PV.pageKeys.clips)
  }
]
