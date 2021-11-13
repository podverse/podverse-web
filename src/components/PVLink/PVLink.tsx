import Link from 'next/link'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'

type Props = {
  children: any
  href: string
}

const onClick = () => {
  // TODO: handle loading spinner show hide
  scrollToTopOfPageScrollableContent()
}

export const PVLink = ({ children, href }: Props) => {
  return (
    <Link
      href={href}>
      <a onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}
