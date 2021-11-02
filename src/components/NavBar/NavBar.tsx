import { NavBarBrand } from './NavBarBrand'
import { NavBarLink } from './NavBarLink'
import { PV } from '~/resources'

import styles from '~/../styles/components/NavBar/NavBar.module.scss'

type Props = {}

export const NavBar = ({}: Props) => {
  return (
    <nav className={styles.wrapper}>
      <NavBarBrand
        height={77}
        href={PV.RouteNames.home}
        src={PV.Images.dark.brandLogo}
        width={300} />
      <NavBarLink
        href={PV.RouteNames.podcasts}
        text='Podcasts' />
      <NavBarLink
        href={PV.RouteNames.episodes}
        text='Episodes' />
      <NavBarLink
        href={PV.RouteNames.clips}
        text='Clips' />
    </nav>
  )
}
