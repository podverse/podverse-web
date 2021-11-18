import Link from 'next/link'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'

type Props = {
  children: any
  href: string
}

export const PVLink = ({ children, href }: Props) => {
  return (
    <Link
      href={href}>
      <a>
        {children}
      </a>
    </Link>
  )
}
