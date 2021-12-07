import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useOmniAural } from 'omniaural'
import { NavBarBrand, NavBarLink, NavBarSectionHeader } from '~/components'
import { PV } from '~/resources'

type Props = unknown

export const NavBar = (props: Props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')

  return (
    <nav className='navbar'>
      <NavBarBrand height={28} href={PV.RoutePaths.web.home} src={PV.Images.dark.brandLogo} width={150} />
      <NavBarLink
        active={router.pathname == PV.RoutePaths.web.search}
        faIconBeginning={faSearch}
        href={PV.RoutePaths.web.search}
        text={t('Search')}
      />
      <hr className='top' />
      <div className='scrollable-content'>
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.podcasts || router.pathname == PV.RoutePaths.web.home}
          href={PV.RoutePaths.web.podcasts}
          text={t('Podcasts')}
        />
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.episodes}
          href={PV.RoutePaths.web.episodes}
          text={t('Episodes')}
        />
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.clips}
          href={PV.RoutePaths.web.clips}
          text={t('Clips')}
        />
        <hr className='bottom' />
        <NavBarSectionHeader text={t('My Library')} />
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.queue}
          href={PV.RoutePaths.web.queue}
          text={t('Queue')}
        />
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.history}
          href={PV.RoutePaths.web.history}
          text={t('History')}
        />
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.my_profile}
          href={userInfo ? `${PV.RoutePaths.web.profile}/${userInfo.id}` : `${PV.RoutePaths.web.my_profile}`}
          text={t('My Profile')}
        />
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.playlists}
          href={PV.RoutePaths.web.playlists}
          text={t('Playlists')}
        />
        <NavBarLink
          active={router.pathname == PV.RoutePaths.web.profiles}
          href={PV.RoutePaths.web.profiles}
          text={t('Profiles')}
        />
      </div>
    </nav>
  )
}
