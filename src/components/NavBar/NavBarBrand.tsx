import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

type Props = {
  height: number
  href: string
  src: string
  width: number
}

export const NavBarBrand = ({ height, href, src, width }: Props) => {
  const { t } = useTranslation()

  return (
    <Link href={href}>
      <a className='navbar__brand'>
        <Image
          alt={t('Podverse logo')}
          height={height}
          src={src}
          width={width}
        />
      </a>
    </Link>
  )
}
