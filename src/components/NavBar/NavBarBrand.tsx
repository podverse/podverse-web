import Image from 'next/image'
import Link from 'next/link'

type Props = {
  height: number
  href: string
  src: string
  width: number
}

export const NavBarBrand = ({ height, href, src, width }: Props) => {
  return (
    <Link href={href}>
      <a className='navbar__brand'>
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
