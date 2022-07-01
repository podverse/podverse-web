import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { PVLink } from '~/components'

type Props = {
  height: number
  href: string
  src: string
  target?: '_blank'
  width: number
}

export const NavBarBrand = ({ height, href, src, target, width }: Props) => {
  const { t } = useTranslation()

  return (
    <PVLink ariaLabel={t('Home page')} className='navbar__brand' href={href} target={target}>
      <Image alt='' aria-hidden height={height} src={src} width={width} />
    </PVLink>
  )
}
