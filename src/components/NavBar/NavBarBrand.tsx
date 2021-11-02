import Image from 'next/image'
import Link from 'next/link'
import styles from '~/../styles/components/NavBar/NavbarBrand.module.scss'

type Props = {
  height: number
  href: string
  src: string
  width: number
}

export const NavBarBrand = ({ height, href, src, width }: Props) => {
  return (
    <Link href={href}>
      <a className={styles.brand}>
        <Image
          alt='Podverse logo'
          height={height}
          src={src}
          width={width}
        />
      </a>
    </Link>
  )
}
