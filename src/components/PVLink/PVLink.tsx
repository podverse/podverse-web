import classnames from 'classnames'
import Link from 'next/link'

type Props = {
  children: any
  className?: string
  href: string
  onClick?: any
}

export const PVLink = ({ children, className, href, onClick }: Props) => {
  const linkClassName = classnames(className ? className : '')
  return (
    <Link href={href}>
      <a className={linkClassName} onClick={onClick}>
        {children}
      </a>
    </Link>
  )
}
