type Props = {
  text: string
}

export const NavBarSectionHeader = ({ text }: Props) => {
  return (
    <div className='navbar__section-header'>
      {text}
    </div>
  )
}
