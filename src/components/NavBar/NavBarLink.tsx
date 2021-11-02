import styles from '~/../styles/components/NavBar/NavBarLink.module.scss'

type Props = {
  text: string
}

export const NavBarLink = ({ text }: Props) => {
  return (
    <a className={styles.link}>
      {text}
    </a>
  )
}
