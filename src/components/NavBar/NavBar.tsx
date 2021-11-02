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
        src={PV.Images.dark.brandLogo}
        width={300} />
      <NavBarLink text='Podcasts' />
      <NavBarLink text='Episodes' />
      <NavBarLink text='Clips' />
    </nav>
  )
}
