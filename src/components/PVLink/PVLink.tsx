import classnames from 'classnames'
import Link from 'next/link'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'

type Props = {
  children: any
  className?: string
  href: string
}

export const PVLink = ({ children, className, href }: Props) => {
  const linkClassName = classnames(
    className ? className : ''
  )
  return (
    <Link
      href={href}>
      <a className={linkClassName}>
        {children}
      </a>
    </Link>
  )
}
