import { useTranslation } from 'next-i18next'
import { NavBarBrand } from './NavBarBrand'
import { NavBarLink } from './NavBarLink'
import { PV } from '~/resources'

type Props = {}

export const NavBar = ({}: Props) => {
  const { t } = useTranslation()

  return (
    <nav className='navbar'>
      <NavBarBrand
        height={77}
        href={PV.RouteNames.home}
        src={PV.Images.dark.brandLogo}
        width={300} />
      <hr />
      <NavBarLink
        href={PV.RouteNames.podcasts}
        text={t('Podcasts')} />
      <NavBarLink
        href={PV.RouteNames.episodes}
        text={t('Episodes')} />
      <NavBarLink
        href={PV.RouteNames.clips}
        text={t('Clips')} />
    </nav>
  )
}
