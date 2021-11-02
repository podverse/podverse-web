import Image from 'next/image'
import styles from '~/../styles/components/NavBar/NavbarBrand.module.scss'

type Props = {
  height: number
  src: string
  width: number
}

export const NavBarBrand = ({ height, src, width }: Props) => {
  return (
    <a className={styles.brand}>
      <Image
        alt='Picture of the author'
        height={height}
        // loader='/vercel.svg'
        src={src}
        width={width}
      />
    </a>
  )
}
