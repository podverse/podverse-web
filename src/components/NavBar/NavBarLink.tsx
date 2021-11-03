import Link from 'next/link'

type Props = {
  href: string
  text: string
}

export const NavBarLink = ({ href, text }: Props) => {
  return (
    <Link href={href}>
      <a className='navbar__link'>
        {text}
      </a>
    </Link>
  )
}
