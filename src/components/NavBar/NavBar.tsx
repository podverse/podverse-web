import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { NavBarBrand, NavBarLink, NavBarSectionHeader } from '~/components'
import { PV } from '~/resources'

type Props = {}

export const NavBar = ({}: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <nav className='navbar'>
      <NavBarBrand
        height={28}
        href={PV.RouteNames.home}
        src={PV.Images.dark.brandLogo}
        width={150} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.search}
        faIconBeginning={faSearch}
        href={PV.RouteNames.search}
        text={t('Search')} />
      <hr className='top' />
      <NavBarLink
        active={router.pathname == PV.RouteNames.podcasts}
        href={PV.RouteNames.podcasts}
        text={t('Podcasts')} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.episodes}
        href={PV.RouteNames.episodes}
        text={t('Episodes')} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.clips}
        href={PV.RouteNames.clips}
        text={t('Clips')} />
      <hr className='bottom' />
      <NavBarSectionHeader text={t('My Library')} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.queue}
        href={PV.RouteNames.queue}
        text={t('Queue')} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.history}
        href={PV.RouteNames.history}
        text={t('History')} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.my_profile}
        href={PV.RouteNames.my_profile}
        text={t('My Profile')} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.playlists}
        href={PV.RouteNames.playlists}
        text={t('Playlists')} />
      <NavBarLink
        active={router.pathname == PV.RouteNames.profiles}
        href={PV.RouteNames.profiles}
        text={t('Profiles')} />
    </nav>
  )
}
