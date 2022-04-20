import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { PVLink } from '~/components'

type Props = {
  height: number
  href: string
  src: string
  width: number
}

export const NavBarBrand = ({ height, href, src, width }: Props) => {
  const { t } = useTranslation()

  return (
    <PVLink ariaLabel={t('Home page')} className='navbar__brand' href={href}>
      <Image alt='' aria-hidden height={height} src={src} width={width} />
    </PVLink>
  )
}
